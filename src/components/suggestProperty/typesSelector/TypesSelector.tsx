import React, { useEffect } from "react";
import { View } from "react-native";

import { useDispatch, useSelector } from "react-redux";

import typesSelectorStyle from "./TypesSelector.style";
import { TypesSelectorProps } from "./TypesSelector.types";

import { RootState } from "~/redux/store";

import { PropertyType } from "~/apiServices/property/property.types";
import { LottieActivityIndicator, TypeSelectorItem } from "~/components/common";
import {
  addPropertyType,
  removePropertyType
} from "~/redux/reducers/propertySocialAction.reducer";

const TypesSelector = (props: TypesSelectorProps): JSX.Element => {
  const { propertyTypes = [], setNextDisabled = () => undefined } = props;
  const dispatch = useDispatch();
  const { mainContainer, lottieLoaderStyle } = typesSelectorStyle;

  const selectedPropertyTypes = useSelector(
    (state: RootState) => state.propertySocialAction.suggestProperty.propertyTypes
  );
  const language = useSelector((state: RootState) => state.settings.language) || "ar";

  const handleItemChecked = (checked: boolean, item: PropertyType) => {
    dispatch(checked ? addPropertyType(item) : removePropertyType(item));
  };

  useEffect(() => {
    if (selectedPropertyTypes.length > 0) {
      setNextDisabled(false);
    } else {
      setNextDisabled(true);
    }
  }, [selectedPropertyTypes, setNextDisabled]);

  return (
    <View style={mainContainer}>
      {propertyTypes ? (
        propertyTypes.map(item => {
          const isSelected =
            selectedPropertyTypes.findIndex(foundItem => foundItem.id === item.id) > -1;

          return (
            <TypeSelectorItem
              key={item?.id}
              item={item}
              title={item?.title[language as "ar" | "en" | "fr"]}
              initialValue={isSelected}
              onCheckedCb={handleItemChecked}
            />
          );
        })
      ) : (
        <LottieActivityIndicator style={lottieLoaderStyle} />
      )}
    </View>
  );
};
export default TypesSelector;
