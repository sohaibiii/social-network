import React, { FC } from "react";
import { TextProps } from "react-native";

import { Text, useTheme } from "react-native-paper";
import { isRTL } from "~/constants/variables";

import styles from "./CText.styles";
import { CTextProps } from "./CText.types";

const CText: FC<CTextProps & TextProps> = props => {
  const { style, children, forceRTL = false, ...rest } = props;
  const theme = useTheme();

  const { textStyle } = styles(theme, props);

  return (
    <Text style={[textStyle, style]} {...rest}>
      {!!forceRTL && isRTL && <Text>&rlm;</Text>}
      {children}
    </Text>
  );
};

export default CText;
