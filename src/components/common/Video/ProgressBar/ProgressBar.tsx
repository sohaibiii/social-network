import React, { useCallback, memo } from "react";
import { View, Text } from "react-native";

import Slider from "@react-native-community/slider";
import { useTheme } from "react-native-paper";

import styles from "./ProgressBar.styles";
import { ProgressBarType } from "./ProgressBar.types";

import { CText } from "~/components/common";
import { isRTL } from "~/constants/variables";

const ProgressBar = (props: ProgressBarType): JSX.Element => {
  const { currentTime, duration, onSlideCapture, onSlideStart, onSlideComplete } = props;
  const theme = useTheme();

  const getMinutesFromSeconds = useCallback(time => {
    const minutes = time >= 60 ? Math.floor(time / 60) : 0;
    const seconds = Math.floor(time - minutes * 60);

    return `${minutes >= 10 ? minutes : "0" + minutes}:${
      seconds >= 10 ? seconds : "0" + seconds
    }`;
  }, []);

  const handleOnSlide = useCallback(
    time => {
      onSlideCapture({ seekTime: time });
    },
    [onSlideCapture]
  );

  const position = getMinutesFromSeconds(currentTime);
  const fullDuration = getMinutesFromSeconds(duration);

  const { timeWrapper, timeLeft, timeRight } = styles(theme);

  return (
    <View>
      <Slider
        value={currentTime}
        minimumValue={0}
        maximumValue={duration}
        step={1}
        onValueChange={handleOnSlide}
        onSlidingStart={onSlideStart}
        onSlidingComplete={onSlideComplete}
        minimumTrackTintColor={theme.colors.primary}
        maximumTrackTintColor={theme.colors.white}
        thumbTintColor={theme.colors.primary}
        inverted={isRTL}
      />
      <View style={timeWrapper}>
        <CText fontSize={14} style={timeLeft}>
          {position}
        </CText>
        <CText fontSize={14} style={timeRight}>
          {fullDuration}
        </CText>
      </View>
    </View>
  );
};

export default memo(ProgressBar);
