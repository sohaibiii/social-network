import React, { memo } from "react";
import { ImageBackground, View } from "react-native";

import { ActivityIndicator, Card, useTheme } from "react-native-paper";

import propertySocialActionIntroCardStyle from "./PropertySocialActionIntroCard.styles";
import { PropertySocialActionIntroCardProps } from "./PropertySocialActionIntroCard.types";

import { CText } from "~/components/";

const PropertySocialActionIntroCard = (props: PropertySocialActionIntroCardProps) => {
  const {
    title = "",
    onPress = () => undefined,
    backgroundImage = null,
    loading = false,
    ...restOfParams
  } = props;

  const theme = useTheme();
  const {
    buttonStyle,
    imageBackgroundStyle,
    loadingOverlay,
    imageStyle,
    titleContainerStyle
  } = propertySocialActionIntroCardStyle(theme);

  return (
    <Card style={buttonStyle} onPress={!loading && onPress} {...restOfParams}>
      {loading && (
        <View style={loadingOverlay}>
          <ActivityIndicator />
        </View>
      )}
      <ImageBackground
        source={backgroundImage}
        imageStyle={imageStyle}
        style={imageBackgroundStyle}
      >
        <View style={titleContainerStyle}>
          <CText color={"white"} lineHeight={16} fontSize={14}>
            {title}
          </CText>
        </View>
      </ImageBackground>
    </Card>
  );
};

export default memo(PropertySocialActionIntroCard);
