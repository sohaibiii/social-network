import { ScrollViewProps } from "react-native";

import Animated from "react-native-reanimated";

interface ParallaxScrollViewInterface extends ScrollViewProps {
  expandedHeader: JSX.Element;
  unexpandedHeader: JSX.Element;
  content?: JSX.Element;
  bounces?: boolean;
  hasBackButton?: boolean;
  contentWithInset?: boolean;
  headerExpandedHeight?: number;
  headerCollapsedHeight?: number;
  animationSpeed?: number;
  gradientColors?: (string | number)[];
  gradientStart?: { x: number; y: number };
  gradientEnd?: { x: number; y: number };
  gradientLocations?: number[];
  headerComponent?: () => JSX.Element;
}

export type ParallaxScrollViewRef = {
  scrollTo: (_x: number, _y: number) => void;
  scrollToEnd: () => void;
};

export interface AnimatedScrollViewRef extends Animated.ScrollView {
  scrollTo: ({ x, y }: { x: number; y: number }) => void;
}

export type ParallaxScrollViewType = ParallaxScrollViewInterface;
