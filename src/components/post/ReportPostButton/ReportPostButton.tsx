import React, { memo } from "react";
import { TouchableOpacity, View } from "react-native";

import { useTheme } from "react-native-paper";

import reportPostButtonStyle from "./ReportPostButton.style";
import { ReportPostButtonProps } from "./ReportPostButton.types";

import { CText } from "~/components/common";

const ReportPostButton = (props: ReportPostButtonProps): JSX.Element => {
  const {
    title = "",
    description = "",
    onPress = () => undefined,
    icon = () => <View />
  } = props || {};
  const { colors } = useTheme();

  const { containerStyle, buttonContainerStyle, textContainerStyle } =
    reportPostButtonStyle(colors);

  return (
    <TouchableOpacity style={containerStyle} onPress={onPress}>
      <View style={buttonContainerStyle}>
        {icon}
        <View style={textContainerStyle}>
          <CText fontSize={13} color={"text"}>
            {title}
          </CText>
          <CText fontSize={10} color={"gray"}>
            {description}
          </CText>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default memo(ReportPostButton);
