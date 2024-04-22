import { Moment } from "moment";

interface DatePickerInterface {
  initValue?: Moment;
  handleDateSetCb?: (_date: Date) => any;
  maxDate?: Date;
  minDate?: Date;
  doneButtonLabel?: string;
  testID?: string;
  label?: string;
  mode?: DatePickerContainerMode;
}

export enum DatePickerContainerMode {
  TEXT_INPUT = "textInput",
  LABEL = "label"
}

export type DatePickerProps = DatePickerInterface;
