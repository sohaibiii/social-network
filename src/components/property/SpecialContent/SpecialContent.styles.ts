import { StyleSheet } from "react-native";

import { APP_SCREEN_HEIGHT, APP_SCREEN_WIDTH } from "~/constants/variables";
import { scale } from "~/utils/";

const styles = (theme: ReactNativePaper.Theme) =>
  StyleSheet.create({
    cardWrapperStyle: {
      width: APP_SCREEN_WIDTH * 0.65,
      height: APP_SCREEN_HEIGHT / 3,
      marginRight: scale(20)
    },
    cardCoverStyle: { flex: 1, backgroundColor: theme.colors.primary },
    cardContentStyle: { backgroundColor: "rgb(238,240,244)" },
    cardActionStyle: {
      backgroundColor: "rgb(238,240,244)",
      borderBottomEndRadius: 5,
      borderBottomStartRadius: 5,
      justifyContent: "space-between",
      paddingTop: 0
    },
    buttonStyle: { borderWidth: 1, paddingHorizontal: 10, borderRadius: 5 },
    buttonLabelStyle: { color: "rgb(42,42,43)" }
  });

export default styles;
