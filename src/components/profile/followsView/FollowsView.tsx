import React from "react";
import { TouchableOpacity } from "react-native";

import { useTheme } from "react-native-paper";

import followsViewStyle from "./FollowsView.style";
import { FollowsViewType } from "./FollowsView.types";

import { CText } from "~/components/common";

const FollowsView = (props: FollowsViewType): JSX.Element => {
  const { count = 0, onPress, label = "" } = props;
  const theme = useTheme();
  const { numberStyle, labelStyle, containerStyle } = followsViewStyle(theme.colors);

  return (
    <TouchableOpacity style={containerStyle} onPress={onPress}>
      <CText style={numberStyle}>{count}</CText>
      <CText style={labelStyle} fontFamily={"light"}>
        {label}
      </CText>
    </TouchableOpacity>
  );
};
export default FollowsView;
