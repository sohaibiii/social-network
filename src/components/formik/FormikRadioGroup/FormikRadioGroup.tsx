import React from "react";

import { Controller, UseControllerReturn } from "react-hook-form";
import { HelperText } from "react-native-paper";

import { FormikRadioGroupProps } from "./FormikRadioGroup.types";

import { RadioGroup } from "~/components/";

const FormikRadioGroup = (props: FormikRadioGroupProps): JSX.Element => {
  const {
    name = "",
    defaultValue = "",
    control,
    onToggleCb = () => {},
    children,
    horizontal = true,
    ...restOfProps
  } = props;

  const render = ({
    field: { onChange },
    fieldState: { error }
  }: UseControllerReturn) => {
    const handleToggled = (value: string) => {
      onToggleCb(value);
      onChange(value);
    };

    return (
      <>
        <RadioGroup
          defaultValue={defaultValue}
          onToggle={handleToggled}
          row={horizontal}
          {...restOfProps}
        >
          {children}
        </RadioGroup>
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

export default FormikRadioGroup;
