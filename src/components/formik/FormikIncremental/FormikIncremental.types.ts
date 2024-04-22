import { ViewStyle } from "react-native";

import { Control } from "react-hook-form";

import { IncrementalProps } from "~/components/common/Incremental/Incremental.types";

interface FormikIncrementalInterface extends IncrementalProps {
  control?: Control<Record<string, string>, object> | undefined;
  name?: string;
  handleOnCountIncreasedCb?: (_count: number) => void;
  handleOnCountDecreasedCb?: (_count: number) => void;
  defaultValue: number;
  title: string;
  description: string;
  minValue: number;
  maxValue: number;
  stepCount: number;
  style: ViewStyle;
  isSmall: boolean;
}
export type FormikIncrementalProps = FormikIncrementalInterface;
