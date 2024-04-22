export interface ConfirmationModalProps {
  description: string;
  confirmText: string;
  cancelTitle: string;
  confirmColor?: string;
  onConfirmCb: () => void;
  onExitCb: () => void;
}
