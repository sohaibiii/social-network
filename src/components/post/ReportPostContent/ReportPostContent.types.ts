export interface ReportPostContentInterface {
  onBackPressedCb?: () => void;
  timestamp?: number;
  pkey?: string;
}

export type ReportPostContentProps = ReportPostContentInterface;
