import React from "react";

import { Controller, UseControllerReturn } from "react-hook-form";
import { HelperText } from "react-native-paper";

import { FormikCheckboxProps } from "./FormikCheckbox.types";

import { Checkbox } from "~/components/";

const FormikCheckbox = (props: FormikCheckboxProps): JSX.Element => {
  const {
    name = "",
    defaultValue = false,
    control,
    onToggleCb = () => {},
    disableError = false,
    ...restOfProps
  } = props;

  const render = ({
    field: { onChange },
    fieldState: { error }
  }: UseControllerReturn) => {
    const handleToggled = (state: boolean) => {
      onToggleCb(state);
      onChange(state);
    };

    return (
      <>
        <Checkbox onPressCb={handleToggled} {...restOfProps} />
        {!disableError && !!error?.message && (
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

export default FormikCheckbox;
