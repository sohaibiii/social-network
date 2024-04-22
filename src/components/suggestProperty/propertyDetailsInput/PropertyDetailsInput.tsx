import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useDebouncedCallback } from "use-debounce";

import propertyDetailsInputStyle from "./PropertyDetailsInput.style";
import { LocationSelectorProps } from "./PropertyDetailsInput.types";

import { RootState } from "~/redux/store";

import { TextInput } from "~/components/";
import {
  setPropertyTitle,
  setPropertyDescription
} from "~/redux/reducers/propertySocialAction.reducer";
import { verticalScale } from "~/utils/";

const PropertyDetailsInput = (props: LocationSelectorProps): JSX.Element => {
  const { setNextDisabled = () => undefined } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const propertyTitle = useSelector(
    (state: RootState) => state.propertySocialAction.suggestProperty.propertyTitle
  );

  const propertyDescription = useSelector(
    (state: RootState) => state.propertySocialAction.suggestProperty.propertyDescription
  );

  const [title, setTitle] = useState(propertyTitle);
  const [description, setDescription] = useState(propertyDescription);

  const { containerStyle, inputContainerStyle, descriptionInputStyle } =
    propertyDetailsInputStyle;

  const debouncedSetTitle = useDebouncedCallback(value => {
    setTitle(value);
    dispatch(setPropertyTitle(value));
  }, 200);

  const debouncedSetDescription = useDebouncedCallback(value => {
    setDescription(value);
    dispatch(setPropertyDescription(value));
  }, 200);

  useEffect(() => {
    if (propertyTitle.length > 0) {
      setNextDisabled(false);
    } else {
      setNextDisabled(true);
    }
  }, [propertyTitle, setNextDisabled]);

  return (
    <View style={containerStyle} collapsable={false}>
      <View style={inputContainerStyle}>
        <TextInput
          defaultValue={title}
          onChangeText={debouncedSetTitle}
          label={t("enter_property_name")}
        />
        <TextInput
          multiline
          scrollEnabled
          defaultValue={description}
          onChangeText={debouncedSetDescription}
          label={t("enter_property_description")}
          numberOfLines={10}
          minHeight={verticalScale(150)}
          maxHeight={verticalScale(150)}
          style={descriptionInputStyle}
        />
      </View>
    </View>
  );
};
export default PropertyDetailsInput;
