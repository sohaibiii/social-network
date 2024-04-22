import React from "react";

import { Controller, UseControllerReturn } from "react-hook-form";
import { HelperText } from "react-native-paper";

import { FormikCountryAndStateSelectorTypes } from "./FormikCountryAndStateSelector.types";

import { Country } from "~/apiServices/country/country.types";
import { CountryAndStateSelector } from "~/components/tripsGuard/CountryAndStateSelector";

const FormikCountryAndStateSelector = (
  props: FormikCountryAndStateSelectorTypes
): JSX.Element => {
  const {
    name = "",
    defaultValue = false,
    control,
    onChangeCb = () => undefined,
    ...restOfProps
  } = props;

  const render = ({
    field: { onChange },
    fieldState: { error }
  }: UseControllerReturn) => {
    const handleOnChange = (state: Country) => {
      onChangeCb(state);
      onChange(state);
    };

    return (
      <>
        <CountryAndStateSelector handleItemSelectedCb={handleOnChange} {...restOfProps} />
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

export default FormikCountryAndStateSelector;
