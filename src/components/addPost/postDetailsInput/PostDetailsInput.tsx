import React, { useState, useCallback, Dispatch, SetStateAction } from "react";
import { TouchableOpacity, View } from "react-native";

import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useDebouncedCallback } from "use-debounce";

import postDetailsInputStyle from "./PostDetailsInput.style";

import { RootState } from "~/redux/store";

import { GooglePlacesAutocomplete, modalizeRef, TextInput } from "~/components/";
import {
  GooglePlaceData,
  GooglePlaceDetail
} from "~/components/common/GooglePlaces/GooglePlaces.types";
import { FormikTextInput } from "~/components/formik";
import { APP_SCREEN_HEIGHT } from "~/constants/";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import {
  setPostDetails,
  setPostLocation
} from "~/redux/reducers/propertySocialAction.reducer";
import { Palestinianize, useYupValidationResolver, verticalScale } from "~/utils/";
import { AddPostSchema } from "~/validationSchemas/addPostSchema";

const MAX_INPUT_LENGTH = 7000;
const ANALYTICS_SOURCE = "add_post_screen_post_details";

const PostDetailsInput = (props: {
  setIsNextDisabled: Dispatch<SetStateAction<boolean>>;
}): JSX.Element => {
  const { setIsNextDisabled } = props;
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const postLocation = useSelector(
    (state: RootState) => state.propertySocialAction.addPost.postLocation
  );
  const postDetails = useSelector(
    (state: RootState) => state.propertySocialAction.addPost.postDetails
  );

  const [title, setTitle] = useState(postLocation.address);
  const [description, setDescription] = useState(postDetails);

  const {
    containerStyle,
    inputContainerStyle,
    descriptionInputStyle,
    contentContainerStyle,
    autoCompleteContainerStyle
  } = postDetailsInputStyle(APP_SCREEN_HEIGHT * 0.8);

  const handleGooglePlaceClicked = (
    data: GooglePlaceData,
    details: GooglePlaceDetail | null
  ) => {
    modalizeRef.current?.close();

    const PalestinianizedAddress = Palestinianize(details?.formatted_address || "");
    dispatch(
      setPostLocation({
        address_components: details?.address_components,
        location: details?.geometry.location,
        address: PalestinianizedAddress
      })
    );
    setTitle(PalestinianizedAddress);
  };

  const renderAutoComplete = useCallback(() => {
    return (
      <View style={autoCompleteContainerStyle}>
        <GooglePlacesAutocomplete
          keepResultsAfterBlur={true}
          hasCurrentLocation={false}
          keyboardShouldPersistTaps={"handled"}
          googlePlaceClickedCb={handleGooglePlaceClicked}
          analyticsSource={ANALYTICS_SOURCE}
        />
      </View>
    );
  }, [handleGooglePlaceClicked]);

  const showSheet = () => {
    dispatch(
      showBottomSheet({
        Content: renderAutoComplete,
        props: {
          disableKeyboardOffset: true,
          scrollViewProps: {
            horizontal: true,
            keyboardShouldPersistTaps: "handled",
            showsVerticalScrollIndicator: false,
            contentContainerStyle: contentContainerStyle,
            scrollEnabled: false
          }
        }
      })
    );
  };
  const resolver = useYupValidationResolver(AddPostSchema(MAX_INPUT_LENGTH));
  const { control } = useForm({ resolver, mode: "onChange" });

  const debouncedSetDescription = useDebouncedCallback(value => {
    setIsNextDisabled(value.length > MAX_INPUT_LENGTH);
    setDescription(value);
    dispatch(setPostDetails(value));
  }, 200);

  return (
    <View style={containerStyle} collapsable={false}>
      <View style={inputContainerStyle}>
        <TouchableOpacity onPress={showSheet}>
          <View pointerEvents="none">
            <TextInput multiline={true} value={title} label={t("post_location")} />
          </View>
        </TouchableOpacity>

        <FormikTextInput
          control={control}
          name={"description"}
          multiline
          scrollEnabled
          defaultValue={description}
          onChangeTextCb={debouncedSetDescription}
          placeholderTextColor={"#959595"}
          placeholder={t("addPostPlaceHolder")}
          numberOfLines={10}
          minHeight={verticalScale(250)}
          maxHeight={verticalScale(250)}
          style={descriptionInputStyle}
        />
      </View>
    </View>
  );
};
export default PostDetailsInput;
