import React from "react";

import LottieView from "lottie-react-native";

import { LottieActivityIndicatorProps } from "./LottieActivityIndicator.types";

import LOTTIE from "~/assets/lottie";

const LottieActivityIndicator = (props: LottieActivityIndicatorProps): JSX.Element => {
  const { style = {} } = props;

  return <LottieView source={LOTTIE.safarway_loading} autoPlay loop style={style} />;
};
export default LottieActivityIndicator;
