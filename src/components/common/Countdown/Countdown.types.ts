import { TextStyle } from "react-native";

export type CountdownRef = {
  resetCountdown: () => void;
};

export enum CountdownVariant {
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
  variant?: CountdownVariant;
}

export type CountdownTypes = CountdownInterface;
