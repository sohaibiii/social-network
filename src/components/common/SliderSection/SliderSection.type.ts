interface SliderSectionInterface {
  title: string;
  subTitle?: string;
  children: React.ReactNode;
  moreCallback?: () => void;
  onLayout?: () => void;
  moreText?: string;
  moreCallbackProperties?: any;
  noFooter?: boolean;
  semiFooter?: boolean;
}

export type SliderSectionProps = SliderSectionInterface;
