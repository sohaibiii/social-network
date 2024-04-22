import React, {
  forwardRef,
  useMemo,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
  memo
} from "react";
import {
  FlatList,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View
} from "react-native";

import isEqual from "react-fast-compare";
import { useTranslation } from "react-i18next";
import { useTheme, ActivityIndicator } from "react-native-paper";
import { useDebouncedCallback } from "use-debounce";

import { styles } from "./GooglePlaces.styles";
import {
  GooglePlacesAutocompleteRef,
  GooglePlacesAutocompleteType
} from "./GooglePlaces.types";

import { Prediction } from "~/apiServices/googleAutoComplete/googleAutoComplete.types";
import { googleAutoCompleteService } from "~/apiServices/index";
import { CText, Icon, IconTypes } from "~/components/";
import { googlePlacesStyles } from "~/components/common/GooglePlacesAutocomplete/GooglePlacesAutoComplete.style";
import {
  GOOGLE_AUTOCOMPLETE_CLEAR_RESULTS_PRESSED,
  GOOGLE_AUTOCOMPLETE_NO_RESULTS,
  GOOGLE_AUTOCOMPLETE_SEARCH,
  logEvent
} from "~/services/analytics";
import { logError, Palestinianize } from "~/utils/";

export const GooglePlacesAutocomplete: React.ForwardRefRenderFunction<
  GooglePlacesAutocompleteRef,
  GooglePlacesAutocompleteType
> = (props: GooglePlacesAutocompleteType, ref): JSX.Element => {
  const { colors, fonts } = useTheme();

  const {
    renderCurrentLocation,
    children,
    disableScroll = false,
    fetchDetails = true,
    listUnderlayColor = colors.lightGray,
    minLength = 0,
    onPress = () => undefined,
    placeholder = "",
    query = {
      key: "missing api key",
      language: "en",
      types: "geocode"
    },
    textInputHide = false,
    analyticsSource = ""
  } = props;

  const { t } = useTranslation();

  const [searchText, setSearchText] = useState("");

  const {
    flex,
    textInputContainer,
    textInput,
    googlePlacesRowContainer,
    centerStyle,
    emptyContainerStyle,
    initialTextContainerStyle,
    topMargin,
    googlePlacesRowIconStyle
  } = useMemo(() => googlePlacesStyles(colors, fonts), [colors, fonts]);

  const { relativeStyle, separator, clearButtonStyle } = useMemo(() => styles, []);

  const [results, setResults] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<TextInput>();

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => inputRef.current?.clear()
  }));

  const _onPress = useCallback(
    async rowData => {
      if (!rowData.isPredefinedPlace && fetchDetails) {
        if (rowData.isLoading === true) {
          return;
        }

        try {
          const { result } = await googleAutoCompleteService.getDetails(
            query,
            rowData.place_id
          );
          _onBlur();

          delete rowData.isLoading;
          onPress(rowData, result);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [fetchDetails, onPress, query]
  );

  const callRequest = useCallback(
    async text => {
      if (text && text.length >= minLength) {
        try {
          const { predictions = [] } = await googleAutoCompleteService.getAutoComplete(
            query,
            text
          );
          if (predictions.length !== 0 || results.length !== 0) {
            setResults(predictions);
            // await logEvent(GOOGLE_AUTOCOMPLETE_SEARCH, {
            //   source: analyticsSource,
            //   search_text: text,
            //   results_count: predictions.length
            // });
          }
          // if (predictions.length === 0) {
          //   await logEvent(GOOGLE_AUTOCOMPLETE_NO_RESULTS, {
          //     source: analyticsSource,
          //     search_text: text
          //   });
          // }
        } finally {
          setIsLoading(false);
        }
      }
    },
    [analyticsSource, minLength, query, results.length]
  );

  const _onChangeTextDebounced = useDebouncedCallback(
    async text => {
      if (text.length === 0) {
        if (results.length > 0) {
          setResults([]);
        }

        if (isLoading) {
          setIsLoading(false);
        }
        return;
      }
      try {
        await callRequest(text);
      } catch (error) {
        logError(`Error: callRequest --GooglePlaces.tsx-- text=${text} ${error}`);
      }
    },
    300,
    { leading: false, trailing: true }
  );

  const _onChangeText = useCallback(
    (text: string) => {
      _onChangeTextDebounced(text);
      setSearchText(text);
      if (!isLoading && text.length > 0) {
        setIsLoading(true);
      }
    },
    [_onChangeTextDebounced, isLoading]
  );

  const _renderRow = useCallback(
    ({ item }) => (
      <TouchableHighlight
        underlayColor={listUnderlayColor}
        onPress={() => _onPress(item)}
      >
        <View style={googlePlacesRowContainer}>
          <View style={googlePlacesRowIconStyle}>
            <Icon
              type={IconTypes.MATERIAL_COMMUNITY_ICONS}
              name={"office-building"}
              size={20}
              color={colors.text}
            />
          </View>
          <View style={flex}>
            <CText fontSize={12}>
              {Palestinianize(item.description || item.formatted_address || item.name)}
            </CText>
            {item?.secondary_text && (
              <CText fontSize={10} color={"grayReversed"}>
                {Palestinianize(item?.secondary_text)}
              </CText>
            )}
          </View>
        </View>
      </TouchableHighlight>
    ),
    [
      _onPress,
      colors.text,
      flex,
      googlePlacesRowContainer,
      googlePlacesRowIconStyle,
      listUnderlayColor
    ]
  );

  const _renderSeparator = useCallback(
    (sectionID, rowID) => {
      if (rowID === results.length - 1) {
        return null;
      }

      return <View key={`${sectionID}-${rowID}`} style={separator} />;
    },
    [results.length, separator]
  );

  const _onBlur = () => {
    inputRef?.current?.blur();
  };

  const handleKeyExtractor = useCallback(item => `${item.place_id}`, []);

  const handleClearResults = useCallback(() => {
    inputRef?.current?.clear();
    if (searchText.length > 0) {
      setSearchText("");
    }
    if (results.length > 0) {
      setResults([]);
    }

    // return logEvent(GOOGLE_AUTOCOMPLETE_CLEAR_RESULTS_PRESSED, {
    //   source: analyticsSource
    // });
  }, [analyticsSource, results.length, searchText.length]);

  const listLoadingComponent = useCallback(
    () => (
      <View style={centerStyle}>
        <ActivityIndicator color={colors.text} style={topMargin} />
        <CText fontSize={13} style={topMargin}>
          {t("loading")}
        </CText>
      </View>
    ),
    [centerStyle, colors.text, t, topMargin]
  );
  const listEmptyComponent = useCallback(() => {
    return (
      <View style={emptyContainerStyle}>
        <View style={googlePlacesRowIconStyle}>
          <Icon
            color={colors.text}
            type={IconTypes.MATERIAL_COMMUNITY_ICONS}
            name={"map-marker-remove"}
            size={100}
          />
        </View>
        <CText style={topMargin}>{t("no_results_found")}</CText>
      </View>
    );
  }, [colors.text, emptyContainerStyle, googlePlacesRowIconStyle, t, topMargin]);

  const listInitialTextComponent = useCallback(() => {
    return (
      <View style={initialTextContainerStyle}>
        <CText fontSize={13} textAlign={"center"} style={topMargin}>
          {t("one_letter_to_start_search")}
        </CText>
      </View>
    );
  }, [initialTextContainerStyle, t, topMargin]);

  return (
    <View style={flex} pointerEvents="box-none">
      {!textInputHide && (
        <View style={textInputContainer}>
          <TextInput
            ref={inputRef}
            style={textInput}
            placeholder={placeholder}
            clearButtonMode="never"
            placeholderTextColor={colors.text}
            onChangeText={_onChangeText}
            autoFocus
          />
        </View>
      )}
      {searchText.length > 0 && (
        <TouchableOpacity style={clearButtonStyle} onPress={handleClearResults}>
          <View>
            <Icon
              type={IconTypes.MATERIAL_COMMUNITY_ICONS}
              name={"close"}
              color={colors.black}
              size={18}
            />
          </View>
        </TouchableOpacity>
      )}
      {!!renderCurrentLocation && renderCurrentLocation()}
      <View style={relativeStyle}>
        {searchText.length === 0 && listInitialTextComponent()}
        {isLoading && listLoadingComponent()}
        {searchText.length > 0 && (
          <FlatList
            nativeID="result-list-id"
            scrollEnabled={!disableScroll}
            data={results}
            ListEmptyComponent={listEmptyComponent}
            keyExtractor={handleKeyExtractor}
            ItemSeparatorComponent={_renderSeparator}
            renderItem={_renderRow}
            {...props}
            keyboardShouldPersistTaps="handled"
          />
        )}
      </View>
      {children}
    </View>
  );
};

export default memo(forwardRef(GooglePlacesAutocomplete), isEqual);
