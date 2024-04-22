import React, { forwardRef, useEffect, useRef, useState } from "react";
import { View } from "react-native";

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { style } from "./HotelCountdown.style";
import { HotelCountdownTypes, HotelCountdownVariant } from "./HotelCountdown.types";

import { RootState } from "~/redux/store";

import { CText } from "~/components/";
import { getSessionRemainingTime } from "~/utils/";
import { msToHMS } from "~/utils/stringUtil";

const HotelCountdown = (props: HotelCountdownTypes): JSX.Element => {
  const { variant } = props;
  const hotelsSessionStartTimestamp = useSelector(
    (state: RootState) => state.hotels.hotelsSessionStartTimestamp
  );

  const intervalRef = useRef<NodeJS.Timeout>();
  const countdownInSeconds = getSessionRemainingTime(hotelsSessionStartTimestamp) * 1000;
  const [countdown, setCountdown] = useState(countdownInSeconds);
  const { t } = useTranslation();
  const { row } = style;
  const renderCountdownWithText = (milliSeconds: number) => {
    let seconds = (milliSeconds / 1000) % 3600;
    const minutes = parseInt((seconds / 60).toString(), 10);
    seconds = seconds % 60;
    const minutesString = minutes < 10 ? "0" + minutes : minutes;
    const secondsString = seconds < 10 ? "0" + seconds : seconds;

    return (
      <View style={row}>
        <CText color={"red"} fontSize={14}>
          {minutesString}
        </CText>
        <CText color={"red"} fontSize={9}>
          {` ${t("shortTime.minute")}  `}
        </CText>
        <CText color={"red"} fontSize={14}>
          {secondsString}
        </CText>
        <CText color={"red"} fontSize={9}>
          {` ${t("shortTime.second")}  `}
        </CText>
      </View>
    );
  };

  const handleDecreaseCountdown = () => {
    setCountdown(prevCountdown => {
      if (prevCountdown <= 0) {
        clearInterval(intervalRef.current as NodeJS.Timeout);
        return prevCountdown;
      }
      return getSessionRemainingTime(hotelsSessionStartTimestamp) * 1000;
    });
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      handleDecreaseCountdown();
    }, 1000);

    return () => {
      clearInterval(intervalRef.current as NodeJS.Timeout);
    };
  }, [handleDecreaseCountdown]);

  return variant === HotelCountdownVariant.WITH_TEXT ? (
    renderCountdownWithText(countdown)
  ) : (
    <CText color={"white"} fontSize={12}>
      {msToHMS(countdown)}
    </CText>
  );
};

export default forwardRef(HotelCountdown);
