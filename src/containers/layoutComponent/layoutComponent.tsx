import React, { useMemo } from "react";
import { Portal, useTheme } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  BottomSheet,
  OverlayLoader,
  Snackbar,
  GallaryViewer,
  CustomStatusBar,
  ConnectionStatus
} from "~/components/";
import style from "./layoutComponents.styles";

const LayoutComponent = (props: { children: JSX.Element }): JSX.Element => {
  const { children } = props;
  const theme = useTheme();
  const { containerStyle } = useMemo(() => style(theme), [theme]);

  return (
    <SafeAreaProvider style={containerStyle}>
      <CustomStatusBar />
      <Portal.Host>{children}</Portal.Host>
      <OverlayLoader />
      <BottomSheet />
      <GallaryViewer />
      <Snackbar />
      <ConnectionStatus />
    </SafeAreaProvider>
  );
};

export default LayoutComponent;
