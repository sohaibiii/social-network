import React, { useEffect, useMemo, useRef } from "react";
import { View } from "react-native";

import { useTranslation } from "react-i18next";
import { useIsConnected } from "react-native-offline";
import { useTheme } from "react-native-paper";
import Animated, { FadeIn, FadeInDown, FadeOutDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import style from "./ConnectionStatus.style";

import { RootState } from "~/redux/store";

import { CText } from "~/components/";
import {
  setIsConnected,
  showConnectionStatus,
  hideConnectionStatus
} from "~/redux/reducers/connectionStatus.reducer";

const ConnectionStatus = (): JSX.Element => {
  const { t } = useTranslation();
  const theme = useTheme();

  const dispatch = useDispatch();
  const deviceConnectionStatus = useIsConnected();

  const isConnected = useSelector(
    (state: RootState) => state.connectionStatus.isConnected
  );

  const isVisible = useSelector((state: RootState) => state.connectionStatus.isVisible);

  const wasDisconected = useRef(false);

  const insets = useSafeAreaInsets();
  const hasBottomSafeArea = !!insets.bottom;

  useEffect(() => {
    dispatch(setIsConnected(deviceConnectionStatus));
  }, [dispatch, deviceConnectionStatus]);

  const { connectionStatusBarStyle, textStyle } = useMemo(
    () => style(theme, isConnected, hasBottomSafeArea),
    [isConnected, theme]
  );

  useEffect(() => {
    let hideConnectionStatusTimeout;
    if (typeof isConnected === "boolean" && !isConnected) {
      if (!wasDisconected?.current) {
        wasDisconected.current = true;
      }
      dispatch(showConnectionStatus());
    } else if (wasDisconected?.current && isConnected) {
      dispatch(showConnectionStatus());
      hideConnectionStatusTimeout = setTimeout(() => {
        dispatch(hideConnectionStatus());
      }, 2000);
    }

    return () => {
      clearTimeout(hideConnectionStatusTimeout);
    };
  }, [dispatch, isConnected]);

  return isVisible ? (
    <Animated.View
      style={connectionStatusBarStyle}
      entering={isConnected ? FadeIn.duration(1000) : FadeInDown.duration(1000)}
      exiting={FadeOutDown.duration(1000)}
    >
      <CText style={textStyle} fontSize={14}>
        {isConnected ? t("internet_connection_restored") : t("no_internet_connection")}
      </CText>
    </Animated.View>
  ) : (
    <View />
  );
};

export default ConnectionStatus;
