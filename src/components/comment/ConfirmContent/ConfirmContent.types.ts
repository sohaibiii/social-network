interface ConfirmContentInterface {
  onPress?: () => void;
  onBackPressedCb?: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: JSX.Element;
  hasLoading?: boolean;
}

export type ConfirmContentProps = ConfirmContentInterface;
