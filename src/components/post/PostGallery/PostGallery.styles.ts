import { StyleSheet } from "react-native";

import { scale, verticalScale } from "~/utils/responsivityUtil";

const styles = StyleSheet.create({
  fastImageStyle: { width: "100%", height: "100%" },
  fastImageRelativeStyle: {
    width: "100%",
    height: "100%",
    position: "relative",
    backgroundColor: "#9DCADC"
  },
  loadingVideoStyle: {
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    minHeight: verticalScale(250),
    width: "100%"
  },
  fullGridWrapperStyle: {
    flex: 1
  },
  flexGrowWithMarginStyle: { flex: 1, margin: 1 },
  flexGrowWithoutMarginStyle: { flex: 1, margin: 0 },

  marginHorizontal: { flex: 1, marginHorizontal: 2 },
  marginVertical: { flex: 1, marginVertical: 2 },
  marginLeft: { flex: 1, marginLeft: 1 },
  marginRight: { flex: 1, marginRight: 1 },
  marginTop: { flex: 1, marginTop: 1 },
  marginBottom: { flex: 1, marginBottom: 1 },

  bigFlexMarginBottom: { flex: 1.5 },
  gridWrapperStyle: {
    flex: 1,
    height: "100%",
    flexDirection: "row"
  },
  gridWrapperColumnStyle: {
    flex: 1,
    height: "100%",
    flexDirection: "column"
  },
  rowFlexMarginStyle: { flex: 1, flexDirection: "row", margin: 1 },
  bigFlexMarginBottomRow: { flex: 1.5, flexDirection: "row", marginBottom: 2 },
  rowFlexMarginBottomStyle: { flex: 1, flexDirection: "row" },
  rowFlexMarginTopStyle: { flex: 1, flexDirection: "row", marginTop: 2 },
  rowFlex: { flex: 1, flexDirection: "row" },
  columnFlexMarginLeftStyle: { flex: 1, flexDirection: "column", marginLeft: 2 },
  flexGrow: {
    flex: 1
  },
  moreGalleryWrapperStyles: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  moreGalleryInnerWrapperStyles: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: scale(5),
    paddingHorizontal: scale(20),
    borderRadius: 10
  },
  videoIconWrapperStyle: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: verticalScale(50),
    height: verticalScale(50),
    borderRadius: verticalScale(25),
    justifyContent: "center",
    alignItems: "center",
    paddingEnd: 5
  },
  videoMuteBackgroundWrapperStyle: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: verticalScale(50),
    height: verticalScale(50),
    borderRadius: verticalScale(25),
    justifyContent: "center",
    alignItems: "center"
  },
  videoMuteWrapperStyles: {
    position: "absolute",
    right: 5,
    bottom: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  uploadingVideoTextStyle: {
    marginTop: verticalScale(18)
  }
});

export default styles;
