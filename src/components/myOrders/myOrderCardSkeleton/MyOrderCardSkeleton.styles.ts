import { StyleSheet } from "react-native";

const myOrderCardSkeletonStyles = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    cardStyle: {
      borderRadius: 10,
      backgroundColor: colors.sliderItemBackground,
      marginBottom: 20
    },
    dividerStyle: {
      height: 1,
      marginTop: 10,
      marginHorizontal: 5,
      backgroundColor: colors.grayBB
    }
  });

export default myOrderCardSkeletonStyles;