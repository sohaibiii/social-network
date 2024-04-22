import React, { useState } from "react";
import { View, SafeAreaView } from "react-native";

import LottieView from "lottie-react-native";
import { useTranslation } from "react-i18next";
import { checkInternetConnection } from "react-native-offline";
import { Text, Button, ProgressBar } from "react-native-paper";

import styles from "./Offline.style";

import LOTTIE from "~/assets/lottie/";
import { useInterval } from "~/utils/";

const Offline = (): JSX.Element => {
  const [progressValue, setProgressValue] = useState<number>(0);
  const [intervalValue, setIntervalValue] = useState<number | null>(null);
  const { t } = useTranslation();

  useInterval(() => {
    if (progressValue < 100) {
      setProgressValue(progressValue + 4);
    } else {
      setIntervalValue(null);
      setProgressValue(0);
    }
  }, intervalValue);

  const handleTryAgain = async () => {
    setIntervalValue(100);
    await checkInternetConnection("https://www.google.com/", 10000, true, "HEAD");
  };

  const {
    container,
    wrapperStyle,
    lottieWrapperStyle,
    primaryTextStyle,
    secondaryTextStyle,
    buttonStyle,
    progressBarStyle,
    progressBarWrapper
  } = styles;

  return (
    <SafeAreaView style={container}>
      <View style={wrapperStyle}>
        <View style={lottieWrapperStyle}>
          <LottieView source={LOTTIE.safarway_offline} autoPlay loop />
        </View>
        <Text style={primaryTextStyle}>{t("no_internet_connection")}</Text>
        <Text style={secondaryTextStyle}>{t("check_your_connection")}</Text>

        <Button mode="contained" onPress={handleTryAgain} contentStyle={buttonStyle}>
          {t("try_again")}
        </Button>
        <View style={progressBarWrapper}>
          <ProgressBar
            progress={progressValue / 100}
            visible={!!progressValue}
            style={progressBarStyle}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Offline;
