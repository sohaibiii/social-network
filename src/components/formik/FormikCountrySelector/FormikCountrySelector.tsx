import React from "react";

import { Controller, UseControllerReturn } from "react-hook-form";
import { HelperText } from "react-native-paper";

import { FormikCountrySelectorType } from "./FormikCountrySelector.types";

import { Country } from "~/apiServices/country/country.types";
import { CountrySelector } from "~/components/";

const FormikCountrySelector = (props: FormikCountrySelectorType): JSX.Element => {
  const {
    name = "",
    defaultValue = { name: "Palestine", code: "PS" },
    control,
    handleItemSelectedCb = () => undefined,
    ...restOfProps
  } = props;

  const render = ({
    field: { onChange },
    fieldState: { error }
  }: UseControllerReturn) => {
    const handleDateSelected = (state: Country) => {
      handleItemSelectedCb(state);
      onChange(state);
    };

    return (
      <>
        <CountrySelector
          defaultValue={defaultValue}
          handleItemSelectedCb={handleDateSelected}
          error={error}
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

export default FormikCountrySelector;
