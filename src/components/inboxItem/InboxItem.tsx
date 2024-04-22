import React, { FC, memo } from "react";
import { TouchableOpacity, View } from "react-native";

import moment from "moment/moment";
import { useTheme, Checkbox } from "react-native-paper";

import { CText } from "../common";

import styles from "./InboxItem.style";
import { InboxItemType } from "./InboxItem.types";

import { scale } from "~/utils/responsivityUtil";

const CustomMarker: FC<InboxItemType> = props => {
  const {
    onPress = () => undefined,
    onChecked = () => undefined,
    isSelected = false,
    item,
    isMultiSelecting = false,
    isThemeDark = false
  } = props;

  const { colors } = useTheme();

  const {
    row,
    selectedContainerStyle,
    darkSelectedContainerStyle,
    seenContainerStyle,
    defaultContainerStyle,
    contentStyle,
    userContainerStyle,
    checkBoxStyle,
    titleStyle
  } = styles(colors);

  const { wasSeen, title = "", brief = "", time = [moment()] } = item;

  const containerStyle = isSelected
    ? isThemeDark
      ? darkSelectedContainerStyle
      : selectedContainerStyle
    : wasSeen
    ? seenContainerStyle
    : defaultContainerStyle;

  const handleChecked = (checked: boolean) => {
    onChecked(item, checked);
  };
  const fontFamily = wasSeen ? "light" : "regular";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={containerStyle}
      onPress={() => (isMultiSelecting ? handleChecked(!isSelected) : onPress(item))}
      onLongPress={() => handleChecked(!isSelected)}
    >
      <View style={row}>
        <Checkbox.Item
          onPress={() => handleChecked(!isSelected)}
          mode={"android"}
          position="leading"
          color={colors.primary_blue}
          style={checkBoxStyle}
          status={isSelected ? "checked" : "unchecked"}
        />
        <View style={userContainerStyle}>
          <View style={contentStyle}>
            <CText
              style={titleStyle}
              fontFamily={fontFamily}
              numberOfLines={1}
              fontSize={14}
              lineHeight={scale(18)}
            >
              {title}
            </CText>
            <CText fontFamily={fontFamily} fontSize={11}>
              {moment(time[0]).fromNow()}
            </CText>
          </View>
          <CText
            numberOfLines={2}
            fontSize={13}
            lineHeight={scale(18)}
            fontFamily="light"
          >
            {brief}
          </CText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(CustomMarker);
