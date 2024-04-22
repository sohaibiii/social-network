import { StyleSheet } from "react-native";

import { scale } from "~/utils/";

const mapFilterModalStyles = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    root: { padding: 5 },
    modalButtonStyle: {
      width: scale(250),
      alignSelf: "center",
      borderRadius: 20,
      marginTop: 20,
      marginBottom: 20
    },
    modalButtonLabelStyle: { color: colors.white },
    dividerStyle: { marginBottom: 10 },
    filtersContainer: {
      flexDirection: "row",
      flexWrap: "wrap"
    },
    filterItemStyle: {
      borderRadius: 5,
      borderWidth: 1,
      borderColor: colors.primary,
      padding: 5,
      marginLeft: 5,
      marginBottom: 5
    }
  });

export default mapFilterModalStyles;
