import { StyleSheet } from "react-native";

import { scale } from "~/utils/responsivityUtil";

const questionViewStyles = (colors: ReactNativePaper.ThemeColors) => {
  return StyleSheet.create({
    root: {
      height: scale(400),
      width: "100%",
      backgroundColor: colors.puzzle.variant3
    },
    answerContainer: {
      flex: 1,
      flexDirection: "row",
      borderBottomColor: colors.gray,
      width: "100%",
      borderBottomWidth: 1,
      paddingLeft: scale(12),
      backgroundColor: colors.puzzle.variant3,
      alignItems: "center",
      justifyContent: "space-between"
    },
    puzzleImage: { width: "100%", height: "100%" },
    puzzleImageContainer: {
      width: "100%",
      height: "52%"
    },
    puzzleTitleStyle: {
      position: "absolute",
      top: scale(172),
      backgroundColor: colors.puzzle.variant1,
      height: scale(30),
      borderTopEndRadius: scale(5),
      borderBottomEndRadius: scale(5),
      alignItems: "center",
      justifyContent: "center",
      start: 0,
      paddingHorizontal: scale(12)
    },
    imageOwnerStyle: {
      position: "absolute",
      top: 0,
      backgroundColor: colors.puzzle.variant2,
      borderBottomStartRadius: scale(5),
      alignItems: "center",
      justifyContent: "center",
      end: 0,
      maxWidth: scale(100),
      paddingHorizontal: scale(10),
      paddingVertical: scale(5)
    },
    counterContainer: {
      width: "100%",
      height: "8%",
      borderTopWidth: 0.2,
      borderBottomWidth: 0.2,
      borderBottomColor: colors.gray,
      borderTopColor: colors.gray,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.lightBackground
    }
  });
};

export default questionViewStyles;
