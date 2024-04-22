import { Control } from "react-hook-form";

interface FormikRadioGroupInterface {
  children?: JSX.Element[];
  onToggleCb?: (_value: string) => void;
  control?: Control<Record<string, string>>;
  name?: string;
  defaultValue?: string;
  horizontal?: boolean;
}

export type FormikRadioGroupProps = FormikRadioGroupInterface;
