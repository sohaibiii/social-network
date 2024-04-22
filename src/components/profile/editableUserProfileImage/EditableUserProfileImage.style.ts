import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from "react-native";

import { verticalScale } from "~/utils/";

type style = {
  image: ImageStyle;
  icon: TextStyle;
  progressiveImage: ViewStyle;
  editIconStyle: ViewStyle;
  removeIconStyle: ViewStyle;
  avatarStyle: ViewStyle;
  deletePhotoContainer: ViewStyle;
  avatarLabelStyle: TextStyle;
};

const editableUserProfileImageStyle = (colors: ReactNativePaper.ThemeColors): style =>
  StyleSheet.create({
    image: {
      borderRadius: 100
    },
    icon: {
      color: colors.primary
    },
    progressiveImage: {
      borderRadius: 100
    },
    editIconStyle: {
      position: "absolute",
      right: 0,
      bottom: 0,
      padding: 8,
      borderRadius: 50,
      backgroundColor: "white"
    },
    removeIconStyle: {
      padding: 8,
      marginTop: verticalScale(8),
      borderRadius: 50,
      alignSelf: "center",
      backgroundColor: "white"
    },
    avatarStyle: {
      height: verticalScale(100),
      borderRadius: 100,
      width: verticalScale(100)
    },
    deletePhotoContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center"
    },
    avatarLabelStyle: { color: colors.white, lineHeight: 65 }
  });

export default editableUserProfileImageStyle;
