import { TFunctionResult } from "i18next";

interface Props {
  isLoading: boolean;
  additionalText?: TFunctionResult | false;
  forceUpdaterPercentage?: number;
  isCodePushUpdate?: boolean;
}

export type SplashScreenProps = Props;
