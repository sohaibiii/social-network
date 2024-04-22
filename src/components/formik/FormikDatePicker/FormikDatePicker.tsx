import React from "react";

import moment from "moment";
import { Controller, UseControllerReturn } from "react-hook-form";
import { HelperText } from "react-native-paper";

import { FormikDatePickerProps } from "./FormikDatePicker.types";

import { DatePicker } from "~/components/";
import { DatePickerContainerMode } from "~/components/common/DatePicker/DatePicker.types";

const FormikDatePicker = (props: FormikDatePickerProps): JSX.Element => {
  const {
    name = "",
    defaultValue = "",
    control,
    handleDateSetCb = () => undefined,
    ...restOfProps
  } = props;

  const render = ({
    field: { onChange },
    fieldState: { error }
  }: UseControllerReturn) => {
    const handleDateSelected = (state: Date) => {
      handleDateSetCb(state);
      onChange(state);
    };

    return (
      <>
        <DatePicker
          initValue={moment(defaultValue)}
          mode={DatePickerContainerMode.TEXT_INPUT}
          handleDateSetCb={handleDateSelected}
          {...restOfProps}
        />
        {!!error?.message && (
          <HelperText type="error" visible={!!error}>
            {`${error?.message}`}
          </HelperText>
        )}
      </>
    );
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={render}
    />
  );
};

export default FormikDatePicker;
