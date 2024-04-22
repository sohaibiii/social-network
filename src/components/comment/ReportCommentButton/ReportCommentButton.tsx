import React, { memo } from "react";
import { TouchableOpacity, View } from "react-native";

import { useTheme } from "react-native-paper";

import reportCommentButtonStyle from "./ReportCommentButton.style";
import { ReportCommentButtonProps } from "./ReportCommentButton.types";

import { CText } from "~/components/common";

const ReportCommentButton = (props: ReportCommentButtonProps): JSX.Element => {
  const {
    title = "",
    description = "",
    onPress = () => undefined,
    icon = () => <View />
  } = props || {};
  const { colors } = useTheme();

  const { containerStyle, buttonContainerStyle, textContainerStyle } =
    reportCommentButtonStyle(colors);

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
export default memo(ReportCommentButton);
