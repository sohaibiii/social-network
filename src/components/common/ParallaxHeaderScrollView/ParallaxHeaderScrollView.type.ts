interface ParallaxHeaderScrollViewInterface {
  children: React.ReactNode;
  stickyHeader: () => JSX.Element;
  parallaxHeader: () => JSX.Element;
  parallaxHeaderHeight: number;
  stickyHeaderHeight: number;
}
export type ParallaxHeaderScrollViewType = ParallaxHeaderScrollViewInterface;
