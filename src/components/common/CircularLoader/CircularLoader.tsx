import React from "react";
import { ActivityIndicator, ActivityIndicatorProps } from "react-native";

import { style } from "./CircularLoader.style";

const CircularLoader = (props: ActivityIndicatorProps): JSX.Element => {
  const { size = "large", ...rest } = props;

  const { loaderStyle } = style;

  return <ActivityIndicator style={loaderStyle} size={size} {...rest} />;
};

export default CircularLoader;
