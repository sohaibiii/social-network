export interface ReportPostButtonInterface {
  onPress?: () => void;
  title?: string;
  description?: string;
  icon?: JSX.Element;
}

export type ReportPostButtonProps = ReportPostButtonInterface;
