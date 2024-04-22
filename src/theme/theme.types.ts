import { LightTheme } from "./theme";

export {};

export type ColorType = keyof typeof LightTheme.colors;

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      gray: string;
      malibu: string;
      primary_reversed: string;
      primary_blue: string;
      primary_blue_d: string;
      primary_blue_light: string;
      primary_blue_medium: string;
      pictonBlue: string;
      whitishBadgeColor: string;
      white: string;
      overlay: string;
      grayBackground: string;
      lightBackground: string;
      lightGray: string;
      borderLightGrayBorder: string;
      bottomSheetOverlay: string;
      grayReversed: string;
      lightishGray: string;
      grayEE: string;
      orange: string;
      black: string;
      vantablack: string;
      profile: ProfileColors;
      skeleton: SkeletonColors;
      followListBackground: string;
      followListBorder: string;
      lighterBackground: string;
      sliderItemBackground: string;
      sliderItemBorderColor: string;
      notifications: NotificationsColors;
      puzzle: PuzzleColors;
      transparentHeader: string;
      darkOverlay: string;
      red: string;
      green: string;
      lightBlue: string;
      grayBB: string;
      lightGrayBackground: string;
      primaryBackground: string;
      searchBarBackground: string;
      shadowOverlay: string;
      homepageItemBackground: string;
      homepageItemText: string;
      darkRed: string;
      darkOrange: string;
      grayFacebookBg: string;
      grayFacebookBtn: string;
      danger_red: string;
    }

    interface Theme {
      myOwnProperty: boolean;
      zIndex: zIndexTypes;
    }

    interface zIndexTypes {
      overlay: number;
      snackbar: number;
      parallax: number;
      videoModal: number;
    }

    interface ProfileColors {
      gradient1: string;
      gradient2: string;
      gradient3: string;
    }

    interface PuzzleColors {
      variant1: string;
      variant2: string;
      variant3: string;
    }
    interface SkeletonColors {
      background: string;
      highlight: string;
    }
    interface NotificationsColors {
      variant1: string;
    }
  }
}
