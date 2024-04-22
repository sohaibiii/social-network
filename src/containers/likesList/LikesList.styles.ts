import { StyleSheet } from "react-native";

const styles = (theme: ReactNativePaper.Theme) =>
  StyleSheet.create({
    headerWrapperStyle: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 10
    },
    likeTextStyle: { marginLeft: 5 },
    safeareaStyle: { flex: 1 },
    separatorStyle: { marginBottom: 10 }
  });

export default styles;
