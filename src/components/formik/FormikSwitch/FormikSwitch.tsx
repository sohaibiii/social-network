import React from "react";

import { Controller, UseControllerReturn } from "react-hook-form";
import { HelperText } from "react-native-paper";

import { FormikSwitchProps } from "./FormikSwitch.types";

import { Switch } from "~/components/";

const FormikSwitch = (props: FormikSwitchProps): JSX.Element => {
  const {
    name = "",
    defaultValue = false,
    control,
    onToggleCb = () => {},
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
        <Switch onToggle={handleToggled} {...restOfProps} defaultValue={!!defaultValue} />
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

export default FormikSwitch;
