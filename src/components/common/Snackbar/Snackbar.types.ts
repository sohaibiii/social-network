export interface SnackbarInterface {
  text?: string;
  button?: ButtonType;
  type?: SnackbarVariations;
  duration?: number;
  textColor?: string;
  buttonColor?: string;
  backgroundColor?: string;
}

interface ButtonType {
  label?: string;
  onPress?: () => void;
}

export enum SnackbarVariations {
  TOAST = "toast",
  SNACKBAR = "snackbar"
}

export type SnackbarTypes = SnackbarInterface;
