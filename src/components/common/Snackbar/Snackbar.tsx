import React from "react";
import { View } from "react-native";

import { Snackbar as RNPSnackbar, Text, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import snackbarStyle from "./Snackbar.style";
import { SnackbarVariations } from "./Snackbar.types";

import { RootState } from "~/redux/store";

import { hideSnackbar } from "~/redux/reducers/snackbar.reducer";

const Snackbar = (): JSX.Element => {
  const { snackbar } = useSelector((reduxState: RootState) => reduxState);
  const dispatch = useDispatch();
  const theme = useTheme();

  const {
    visible = false,
    text = "",
    textColor = theme.colors.white,
    button = {},
    type = SnackbarVariations.TOAST,
    duration = 1000,
    backgroundColor = "black",
    buttonColor = theme.colors.accent
  } = snackbar;

  const handleSnackbarDismiss = () => {
    dispatch(hideSnackbar());
  };

  const { containerStyle, snackBarStyle, toastStyle, toastTextStyle, snackbarTextStyle } =
    snackbarStyle(theme);

  const isToast = type === SnackbarVariations.TOAST;
  const action = !isToast && button;
  const style = [isToast ? toastStyle : snackBarStyle, { backgroundColor }];
  const textStyle = [isToast ? toastTextStyle : snackbarTextStyle, { color: textColor }];
  const snackbarTheme = { colors: { accent: buttonColor } };

  return (
    <View style={containerStyle}>
      {visible && (
        <RNPSnackbar
          style={style}
          duration={duration}
          visible={visible}
          action={action}
          theme={snackbarTheme}
          onDismiss={handleSnackbarDismiss}
        >
          <Text style={textStyle}>{text}</Text>
        </RNPSnackbar>
      )}
    </View>
  );
};
export default Snackbar;
