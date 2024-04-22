import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";

export const SLICE_NAME = "snackbar";

export interface SnackbarInterface {
  visible?: boolean;
  text?: string;
  textColor?: string;
  button?: ButtonType | any;
  buttonColor?: string;
  type?: SnackbarVariations;
  duration?: number;
  backgroundColor?: string;
}

interface ButtonType {
  label?: string;
  onPress?: () => void;
}
