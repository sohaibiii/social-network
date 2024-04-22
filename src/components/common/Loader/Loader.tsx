import React from "react";
import { View } from "react-native";

import LottieView from "lottie-react-native";
import { Text, useTheme } from "react-native-paper";

import styles from "./Loader.styles";

import LOTTIE from "~/assets/lottie/";
import { CText } from "~/components/common";

const Loader = () => {
  const theme = useTheme();

  const { lottieViewStyle, container, lottieWaitTextStyle, loaderWrapperStyle } =
    styles(theme);
  return (
    <View style={container}>
      <View style={loaderWrapperStyle}>
        <LottieView
          source={LOTTIE.safarway_loader}
          autoPlay
          loop
          style={lottieViewStyle}
        />
      </View>
      <CText style={lottieWaitTextStyle}>Please wait</CText>
    </View>
  );
};

export default Loader;
