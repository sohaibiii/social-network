import { StyleSheet } from "react-native";

export const qrScannerStyles = StyleSheet.create({
  flexGrow: { flex: 1 },
  customMarkerWrapperStyle: {
    flex: 1,
    width: "100%",
    position: "relative"
  },
  customCameraWrapperStyle: {
    position: "absolute",
    width: "80%",
    height: "60%",
    top: "20%",
    left: "10%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999
  },
  customMarkerTopLeftCornerStyle: {
    position: "absolute",
    top: -1,
    left: -1,
    height: 50,
    width: 50,
    borderColor: "#c1c1c1",
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderRadius: 20,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0
  },
  customMakerTopRightCornerStyle: {
    position: "absolute",
    top: -1,
    right: -1,
    height: 50,
    width: 50,
    borderColor: "#c1c1c1",
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderRadius: 20,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  customMarkerBottomLeftCornerStyle: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 50,
    width: 50,
    borderColor: "#c1c1c1",
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderRadius: 20,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  customMarkerBottomRightCornerStyle: {
    position: "absolute",
    bottom: -1,
    right: -1,
    height: 50,
    width: 50,
    borderColor: "#c1c1c1",
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderRadius: 20,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0
  }
});
