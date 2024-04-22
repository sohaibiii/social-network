export interface ExitDialogContentInterface {
  withSaveWork?: boolean;
  onCancelCb: () => void;
  onExitCb: (_shouldSaveWork: boolean) => void;
}

export type ExitDialogContentProps = ExitDialogContentInterface;
