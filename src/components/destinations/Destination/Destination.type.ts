interface DestinationInterface {
  title: string;
  subTitle?: string;
  featuredImage: string;
  aspectRatio: number;
  width: number;
  slug: string;
  shouldRenderProgressive?: boolean;
  shouldRenderFast?: boolean;
  type: string;
  hiddenSubTitle?: string;
  analyticsSource?: string;
  pkey?: string;
  isSpecialDestination?: boolean;
  isFromContinents?: boolean;
  index?: number;
}

export type DestinationProps = DestinationInterface;
