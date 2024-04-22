import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import { View } from "react-native";

import { useTranslation } from "react-i18next";

import { CText } from "~/components/";
import {
  CountdownRef,
  CountdownTypes,
  CountdownVariant
} from "~/components/common/Countdown/Countdown.types";

const Countdown: React.ForwardRefRenderFunction<CountdownRef, CountdownTypes> = (
  props: CountdownTypes,
  forwardedRef
): JSX.Element => {
  const {
    countdownSeconds = 30,
    countdownStartedCb = () => undefined,
    countdownReachedCb = () => undefined,
    hideOnCountdownReached = false,
    labelStyle = {},
    fontSize = 12,
    smallerTextFontSize = 9,
    variant = CountdownVariant.DEFAULT,
    ...rest
  } = props;

  const intervalRef = useRef<NodeJS.Timeout>();
  const countdownInSeconds = countdownSeconds * 1000;
  const [countdown, setCountdown] = useState(countdownInSeconds);
  const { t } = useTranslation();

  useImperativeHandle(forwardedRef, () => ({
    resetCountdown() {
      clearInterval(intervalRef.current as NodeJS.Timeout);
      setCountdown(countdownInSeconds);
      intervalRef.current = setInterval(() => {
        handleDecreaseCountdown();
      }, 1000);
    }
  }));

  const msToHMS = (milliSeconds: number) => {
    let seconds = (milliSeconds / 1000) % 3600;
    const minutes = parseInt((seconds / 60).toString(), 10);
    seconds = seconds % 60;
    const minutesString = minutes < 10 ? "0" + minutes : minutes;
    const secondsString = seconds < 10 ? "0" + seconds : seconds;
    return minutesString + ":" + secondsString;
  };

  const renderCountdownWithText = (milliSeconds: number) => {
    let seconds = (milliSeconds / 1000) % 3600;
    const minutes = parseInt((seconds / 60).toString(), 10);
    seconds = seconds % 60;
    const minutesString = minutes < 10 ? "0" + minutes : minutes;
    const secondsString = seconds < 10 ? "0" + seconds : seconds;

    return (
      <CText style={labelStyle} {...rest}>
        {minutesString}
        <CText style={labelStyle} fontSize={smallerTextFontSize}>
          {` ${t("shortTime.minute")}  `}
        </CText>
        {secondsString}
        <CText style={labelStyle} fontSize={smallerTextFontSize}>
          {` ${t("shortTime.second")}  `}
        </CText>
      </CText>
    );
  };

  const handleDecreaseCountdown = () => {
    setCountdown(prevCountdown => {
      if (prevCountdown <= 0) {
        clearInterval(intervalRef.current as NodeJS.Timeout);
        return prevCountdown;
      }
      if (prevCountdown - 1000 <= 0) {
        if (countdownReachedCb) {
          countdownReachedCb();
        }
      }
      return prevCountdown - 1000;
    });
  };

  useEffect(() => {
    if (countdown === countdownInSeconds) {
      if (countdownStartedCb) {
        countdownStartedCb();
      }
    }
  }, [countdown]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      handleDecreaseCountdown();
    }, 1000);

    return () => {
      clearInterval(intervalRef.current as NodeJS.Timeout);
    };
  }, []);

  if (countdown === 0 && hideOnCountdownReached) return <View />;

  return variant === CountdownVariant.WITH_TEXT ? (
    renderCountdownWithText(countdown)
  ) : (
    <CText style={labelStyle} fontSize={fontSize} {...rest}>
      {msToHMS(countdown)}
    </CText>
  );
};

export default forwardRef(Countdown);
