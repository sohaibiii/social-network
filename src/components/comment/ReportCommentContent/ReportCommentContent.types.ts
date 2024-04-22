export interface ReportCommentContentInterface {
  onBackPressedCb?: () => void;
  timestamp?: number;
  pkey?: string;
  index: number;
}

export type ReportCommentContentProps = ReportCommentContentInterface;
