import { StyleSheet, ViewStyle } from "react-native";

import { moderateScale } from "~/utils/responsivityUtil";

type style = {
  itemContainer: ViewStyle;
  flatListStyle: ViewStyle;
};

const favouriteListStyles = (colors: ReactNativePaper.ThemeColors): style => {
  return StyleSheet.create({
    flatListStyle: { padding: 5, backgroundColor: colors.lightBackground },
    itemContainer: {
      backgroundColor: colors.lightishGray,
      padding: moderateScale(10),
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
      marginBottom: moderateScale(10),
      borderRadius: 5,
      borderColor: colors.grayEE,
      borderWidth: 1
    }
  });
};
export default favouriteListStyles;
