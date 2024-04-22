import React from "react";
import { ImageBackground, ImageBackgroundProps, View, ViewProps } from "react-native";

import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import { useSelector } from "react-redux";

import overlayLoaderStyle from "./OverlayLoader.style";
import { OverlayLoaderBackground } from "./OverlayLoader.types";

import { RootState } from "~/redux/store";

const OverlayLoader = (): JSX.Element => {
  const overlayLoader = useSelector((reduxState: RootState) => reduxState.overlayLoader);
  const theme = useTheme();

  const {
    visible,
    title = "",
    mode = OverlayLoaderBackground.COLOR,
    description = "",
    imageUrl = "",
    backgroundColor = theme.colors.overlay
  } = overlayLoader;

  if (!visible) return <></>;

  const { container, titleStyle, descriptionStyle } = overlayLoaderStyle(theme);
  const imageSource = mode === OverlayLoaderBackground.IMAGE ? { uri: imageUrl } : {};

  const Container = (
    containerProps: ImageBackgroundProps & ViewProps & { children: JSX.Element[] }
  ) => {
    if (mode === OverlayLoaderBackground.IMAGE) {
      return <ImageBackground {...containerProps} />;
    } else {
      return <View {...containerProps} />;
    }
  };

  const containerStyle = [container, { backgroundColor }];

  return (
    <Container source={imageSource} style={containerStyle}>
      <ActivityIndicator size={"large"} />
      <Text style={titleStyle}>{title}</Text>
      <Text style={descriptionStyle}>{description}</Text>
    </Container>
  );
};
export default OverlayLoader;
