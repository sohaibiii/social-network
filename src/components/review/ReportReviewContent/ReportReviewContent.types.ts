import { ReviewCardAnalyticsTypes } from "~/components/common/reviewCard/reviewCard.types";

export interface ReportPostContentInterface {
  onBackPressedCb?: () => void;
  timestamp?: number;
  pkey?: string;
  analyticsType?: ReviewCardAnalyticsTypes;
}

export type ReportPostContentProps = ReportPostContentInterface;
