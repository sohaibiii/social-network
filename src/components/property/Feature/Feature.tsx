import React from "react";
import { View } from "react-native";

import styles from "./Feature.styles";
import { FeatureType } from "./Feature.types";

import { CText, Icon, IconTypes } from "~/components/common";
import { scale } from "~/utils/responsivityUtil";

const Feature = (props: FeatureType): JSX.Element => {
  const { feature } = props;
  const { checkIconStyle, featureWrapperStyle } = styles;

  return (
    <View style={featureWrapperStyle}>
      <Icon
        type={IconTypes.SAFARWAY_ICONS}
        disabled
        name={"check_mark"}
        width={scale(12)}
        height={scale(12)}
        color={"#5CC3EE"}
        style={checkIconStyle}
      />
      <CText fontSize={13} fontFamily={"light"}>
        {feature}
      </CText>
    </View>
  );
};

export default Feature;
