import { ScrollViewProps, ViewStyle } from "react-native";

interface PagerViewStepsInterface extends ScrollViewProps {
  title?: string | string[];
  pages?: JSX.Element[];
  headerExpandedHeight?: number | number[];
  containerStyle?: ViewStyle;
  pagerViewStyle?: ViewStyle;
  gradientStart?: { x: number; y: number };
  gradientEnd?: { x: number; y: number };
  nextButtonDisabled?: boolean;
  onFinishPressed?: () => void;
  onPreviousPressed?: (_currentPage: number, _isSkipping: boolean) => void;
  onNextPressed?: (_currentPage: number, _isSkipping: boolean) => void;
  onExitCb?: (_shouldSaveWork: boolean) => void;
  getStepCount?: (_page: number) => number;
  stepSize?: number;
  clearDataCb?: () => void;
  pageCallback?: (page: number) => void;
  lastButtonLabel?: string;
}

export type PagerViewStepsProps = PagerViewStepsInterface;
