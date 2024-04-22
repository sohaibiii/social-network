import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { APP_SCREEN_HEIGHT, APP_SCREEN_WIDTH } from "~/constants/variables";

type HeaderCardType = {
  cardStyles: ViewStyle;
  cardBodyStyle: ViewStyle;
  textWrapperStyle: ViewStyle;
  iconWrapperStyle: ViewStyle;
  headerTitleStyle: TextStyle;
};

const styles = (theme: ReactNativePaper.Theme, language: string): HeaderCardType =>
  StyleSheet.create({
    cardStyles: {
      marginRight: 10,
      borderRadius: 6,
      aspectRatio: 0.8,
      width: APP_SCREEN_WIDTH / 4.1,
      flex: 1,
      backgroundColor: theme.colors.homepageItemBackground,
      height: APP_SCREEN_HEIGHT / 7
    },
    cardBodyStyle: {
      flex: 1,
      alignItems: "center",
      paddingHorizontal: 5,
      position: "absolute",
      top: 10,
      right: 0,
      left: 0,
      bottom: 0
    },
    iconWrapperStyle: { flex: 2, justifyContent: "flex-end" },
    textWrapperStyle: { flex: 3, marginTop: 5 },
    headerTitleStyle: { paddingBottom: 2 }
  });

export default styles;
