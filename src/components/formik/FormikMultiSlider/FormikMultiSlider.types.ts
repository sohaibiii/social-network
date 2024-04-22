import { MultiSliderProps } from "@ptomasroos/react-native-multi-slider";
import { Control } from "react-hook-form";

interface FormikMultiSliderInterface extends MultiSliderProps {
  onValuesChangeFinishCb?: (_value: number[]) => void;
  topLabel?: (_value: number) => string;
  testID?: string;
  control?: Control<Record<string, string>>;
  name?: string;
  defaultValue?: string;
}
export type FormikMultiSliderProps = FormikMultiSliderInterface;
