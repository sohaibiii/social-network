import { StyleSheet } from "react-native";

import { Theme } from "react-native-paper/src/types";

import { scale, verticalScale } from "~/utils/";

const styles = StyleSheet.create({
  flatListContentContainerStyle: {
    marginVertical: verticalScale(6),
    paddingHorizontal: scale(4)
  },
  adStyle: {
    marginBottom: verticalScale(8),
    marginStart: -scale(4)
  },
  safeareaViewStyle: theme => ({ flex: 1, backgroundColor: theme.colors.background }),
  propertyCardContainerStyle: (index: number, theme: Theme) => ({
    backgroundColor: theme.colors.sliderItemBackground,
    marginBottom: scale(8),
    borderRadius: 8,
    marginRight: scale(4),
    marginLeft: scale(4),
    paddingBottom: verticalScale(6)
  }),
  separatorViewStyle: { height: 10 },
  skeletonWrapperStyle: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between"
  }
});

export default styles;
