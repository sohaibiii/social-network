import { DefaultTheme, configureFonts } from "react-native-paper";

import "./theme.types";
import { FONT_CONFIG } from "./fonts/";

const LightTheme = {
  ...DefaultTheme,
  // Specify custom property
  myOwnProperty: true,
  dark: false,
  // Specify custom property in nested object
  zIndex: {
    overlay: 10,
    snackbar: 10,
    parallax: 10,
    videoModal: 9999
  },
  colors: {
    ...DefaultTheme.colors,
    primary: "#5EC3ED",
    primary_blue: "#0F3493",
    primary_reversed: "#0F3493",
    primary_blue_d: "#0F3493",
    primary_blue_light: "#F7F9FE",
    primary_blue_medium: "#cad7f8",
    primaryBackground: "#FFFFFF",
    whitishBadgeColor: "#EDEDED",
    searchBarBackground: "rgb(246,246,246)",
    accent: "#f1c40f",
    orange: "#F7B500",
    darkOrange: "#f27a44",
    gray: "#888888",
    grayReversed: "#717171",
    grayEE: "#EEEEEE",
    malibu: "#95E3F8",
    pictonBlue: "#5CC3EE",
    text: "#444444",
    white: "#FFFFFF",
    black: "#000000",
    vantablack: "#000000",
    overlay: "rgba(193,193,193,0.5)",
    grayBackground: "#F9F9F9",
    lightBackground: "#fff",
    lightGray: "#D3D3D3",
    borderLightGrayBorder: "#D3D3D3",
    bottomSheetOverlay: "rgba(0,0,0,0.5)",
    lightishGray: "#F5F5F5",
    profile: {
      gradient1: "#dff2ff",
      gradient2: "#dff2ff",
      gradient3: "#b8e3ff"
    },
    skeleton: {
      highlight: "#F2F8FC",
      background: "#E1E9EE"
    },
    notifications: {
      variant1: "#EFFAFF"
    },
    reversed: "#000",
    lighterBackground: "#EFFAFF",
    followListBackground: "#EFFAFF",
    followListBorder: "#EEEEEE",
    sliderItemBackground: "#FFFFFF",
    sliderItemBorderColor: "#DDDDDD",
    puzzle: {
      variant1: "rgba(255, 255, 255, 0.8)",
      variant2: "rgba(0,0,0,0.6)",
      variant3: "#EFFAFF"
    },
    transparentHeader: "rgba(255,255,255,0.6)",
    darkOverlay: " rgba(0, 0, 0, 0.1)",
    red: "#D60061",
    green: "#4BB543",
    lightBlue: "#55B8E1",
    grayBB: "#BBBBBB",
    lightGrayBackground: "#f5f8fe",
    shadowOverlay: "rgba(0,0,0,0.15)",
    homepageItemBackground: "rgb(255,255,255)",
    homepageItemText: "#444444",
    darkRed: "#FF0000",
    grayFacebookBg: "#F7F8FA",
    grayFacebookBtn: "#DEE1E5",
    danger_red: "#d13e3e"
  },

  mode: "exact",
  fonts: configureFonts(FONT_CONFIG)
};

const DarkTheme = {
  ...DefaultTheme,
  // Specify custom property
  myOwnProperty: true,
  dark: true,
  // Specify custom property in nested object
  zIndex: {
    overlay: 10,
    snackbar: 10,
    parallax: 10,
    videoModal: 9999
  },
  colors: {
    ...DefaultTheme.colors,
    primary: "#338FCC",
    primary_blue: "#0c2d80",
    primary_reversed: "#338FCC",
    primary_blue_d: "#6188ee",
    primary_blue_light: "#a0a5b3",
    primary_blue_medium: "#8994b3",
    background: "#1C1C21",
    primaryBackground: "#1C1C21",
    whitishBadgeColor: "#2d2d2d",
    searchBarBackground: "#202A33",
    accent: "#00c40f",
    grayReversed: "#ececec",
    gray: "#B1B1B2",
    grayEE: "#202A33",
    orange: "#F7B500",
    darkOrange: "#f27a44",
    lightishGray: "#1C1C21",
    malibu: "#4acff3",
    pictonBlue: "#20ade7",
    surface: "#0D2836",
    text: "#B1B1B2",
    white: "#FFFFFF",
    black: "#FFFFFF",
    vantablack: "#000000",
    overlay: "rgba(0,0,0,0.5)",
    grayBackground: "#1C1C21",
    lightBackground: "#202A33",
    lightGray: "#202A33",
    borderLightGrayBorder: "#e9e9e9",
    bottomSheetOverlay: "rgba(0,0,0,0.7)",
    profile: {
      gradient1: "#0D2836",
      gradient2: "#091c24",
      gradient3: "#1a1a1a"
    },
    skeleton: {
      highlight: "#0a212a",
      background: "#081921"
    },
    notifications: {
      variant1: "#202A33"
    },
    lighterBackground: "#00a9f7",
    followListBackground: "#202A33",
    followListBorder: "#38424C",
    sliderItemBackground: "#202A33",
    sliderItemBorderColor: "#38424C",
    puzzle: {
      variant1: "rgba(0, 0, 0, 0.8)",
      variant2: "rgba(0,0,0,0.6)",
      variant3: "#202A33"
    },
    transparentHeader: "rgba(0,0,0,0.8)",
    darkOverlay: " rgba(0, 0, 0, 0.1)",
    red: "#D60061",
    green: "#255a21",
    lightBlue: "#55B8E1",
    grayBB: "#BBBBBB",
    lightGrayBackground: "#0D2836",
    shadowOverlay: "rgba(255,255,255,0.15)",
    homepageItemBackground: "rgb(29, 28, 33)",
    homepageItemText: "#E9E9E9",
    darkRed: "#FF0000",
    grayFacebookBg: "#1C1C21",
    grayFacebookBtn: "#b3b9c3",
    danger_red: "#d13e3e"
  },
  mode: "exact",
  fonts: configureFonts(FONT_CONFIG)
};

export { DarkTheme, LightTheme };
