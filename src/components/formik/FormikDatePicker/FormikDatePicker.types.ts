import { Control } from "react-hook-form";

import { DatePickerProps } from "~/components/common/DatePicker/DatePicker.types";

interface FormikDatePickerInterface {
  defaultValue?: string;
  name?: string;
  control?: Control<Record<string, string>>;
  testID?: string;
}

export type FormikDatePickerProps = FormikDatePickerInterface & DatePickerProps;
