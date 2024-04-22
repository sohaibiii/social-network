import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { TouchableOpacity, View, InteractionManager } from "react-native";

import { useTranslation } from "react-i18next";
import { ActivityIndicator, useTheme } from "react-native-paper";
import { useSelector } from "react-redux";

import { googlePlacesAutocompleteStyle } from "./GooglePlacesAutoComplete.style";
import { GooglePlacesAutocompleteProps } from "./GooglePlacesAutocomplete.types";

import { RootState } from "~/redux/store";

import { CText, Icon, IconTypes } from "~/components/common";
import { GooglePlaces } from "~/components/common/GooglePlaces";
import {
  StructuredFormatting,
  GooglePlacesAutocompleteRef
} from "~/components/common/GooglePlaces/GooglePlaces.types";
import { Palestinianize } from "~/utils/";

const GooglePlacesAutocomplete = (props: GooglePlacesAutocompleteProps): JSX.Element => {
  const {
    getCurrentLocationCb = () => undefined,
    googlePlaceClickedCb = () => undefined,
    keyboardShouldPersistTaps = "never",
    keepResultsAfterBlur = true,
    hasCurrentLocation = false,
    analyticsSource = ""
  } = props;

  const { colors } = useTheme();
  const { t } = useTranslation();
  const googlePlacesRef = useRef<GooglePlacesAutocompleteRef>(null);

  const language = useSelector((state: RootState) => state.settings.language || "ar");

  const {
    googlePlacesRowContainer,
    googlePlacesRowIconStyle,
    currentLocationButtonStyle,
    topMargin,
    centerStyle
  } = useMemo(() => googlePlacesAutocompleteStyle(colors), [colors]);

  const renderGetCurrentLocationButton = useCallback(
    () =>
      hasCurrentLocation ? (
        <TouchableOpacity
          onPress={getCurrentLocationCb}
          style={currentLocationButtonStyle}
        >
          <View style={googlePlacesRowIconStyle}>
            <Icon
              color={colors.text}
              type={IconTypes.FONTAWESOME5}
              name={"location-arrow"}
              size={16}
            />
          </View>
          <CText fontSize={12} color={"text"}>
            {t("use_current_location")}
          </CText>
        </TouchableOpacity>
      ) : (
        <View />
      ),
    [
      colors.text,
      currentLocationButtonStyle,
      googlePlacesRowIconStyle,
      hasCurrentLocation,
      t
    ]
  );

  const loaderComponent = useCallback(() => {
    return (
      <View style={centerStyle}>
        <ActivityIndicator color={colors.text} style={topMargin} />
        <CText fontSize={13}>{t("loading")}</CText>
      </View>
    );
  }, [centerStyle, colors.text, t, topMargin]);

  const query = useMemo(
    () => ({
      language
    }),
    []
  );

  const renderGooglePlacesRow = useCallback(
    ({
      structured_formatting,
      description: rowDescription
    }: {
      structured_formatting: StructuredFormatting;
      description: string;
    }) => {
      if (!structured_formatting) {
        return;
      }
      return (
        <View style={googlePlacesRowContainer}>
          <View style={googlePlacesRowIconStyle}>
            <Icon
              type={IconTypes.MATERIAL_COMMUNITY_ICONS}
              name={"office-building"}
              size={20}
              color={colors.text}
            />
          </View>
          <View>
            <CText fontSize={12}>
              {Palestinianize(structured_formatting?.main_text || rowDescription)}
            </CText>
            <CText fontSize={10}>
              {Palestinianize(structured_formatting?.secondary_text || "")}
            </CText>
          </View>
        </View>
      );
    },
    [colors.text, googlePlacesRowContainer, googlePlacesRowIconStyle]
  );

  return (
    <>
      <GooglePlaces
        ref={googlePlacesRef}
        fetchDetails
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        autoFillOnNotFound={false}
        renderCurrentLocation={renderGetCurrentLocationButton}
        listLoaderComponent={loaderComponent}
        keepResultsAfterBlur={keepResultsAfterBlur}
        renderRow={renderGooglePlacesRow}
        onPress={googlePlaceClickedCb}
        enablePoweredByContainer={false}
        placeholder={t("location_search_text")}
        query={query}
        debounce={500}
        analyticsSource={analyticsSource}
      />
    </>
  );
};

export default GooglePlacesAutocomplete;
