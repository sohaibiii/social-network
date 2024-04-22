export interface ReportReplyContentInterface {
  onBackPressedCb?: () => void;
  timestamp?: number;
  pkey?: string;
  index: number;
}

export type ReportReplyContentProps = ReportReplyContentInterface;
