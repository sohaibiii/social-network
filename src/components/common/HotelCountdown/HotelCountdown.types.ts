import { TextStyle } from "react-native";

export type CountdownRef = {
  resetCountdown: () => void;
};

export enum HotelCountdownVariant {
  DEFAULT = "default",
  WITH_TEXT = "withText"
}
interface CountdownInterface {
  countdownSeconds?: number;
  hideOnCountdownReached?: boolean;
  countdownStartedCb?: () => void;
  countdownReachedCb?: () => void;
  labelStyle: TextStyle;
  fontSize?: number;
  smallerTextFontSize?: number;
  variant?: HotelCountdownVariant;
}

export type HotelCountdownTypes = CountdownInterface;
