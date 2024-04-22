import { StyleSheet, TextStyle } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { CTextProps } from "./CText.types";

type style = {
  textStyle: TextStyle;
};

const styles = (theme: ReactNativePaper.Theme, props: CTextProps): style => {
  const { colors, fonts } = theme;
  const {
    fontSize = 19,
    color = "text",
    fontFamily = "regular",
    lineHeight,
    textAlign = "left"
  } = props;
  return StyleSheet.create({
    textStyle: {
      fontSize: RFValue(fontSize),
      color: colors[color],
      fontFamily: fonts[fontFamily].fontFamily,
      fontWeight: fonts[fontFamily].fontWeight,
      lineHeight: RFValue(fontSize+2),
      textAlign
    }
  });
};
export default styles;
