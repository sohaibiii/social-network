export interface ReportCommentButtonInterface {
  onPress?: () => void;
  title?: string;
  description?: string;
  icon?: JSX.Element;
}

export type ReportCommentButtonProps = ReportCommentButtonInterface;
