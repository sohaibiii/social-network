import React from "react";

import { Controller, UseControllerReturn } from "react-hook-form";
import { HelperText } from "react-native-paper";

import { FormikFiltersSelectorItemProps } from "./FormikFiltersSelectorItem.types";

import { FiltersSelectorItem } from "~/components/hotels/filtersSelectorItem";

const FormikFiltersSelectorItem = (
  props: FormikFiltersSelectorItemProps
): JSX.Element => {
  const {
    name = "",
    defaultValue = false,
    control,
    onCheckedCb = () => undefined,
    ...restOfProps
  } = props;

  const render = ({
    field: { onChange, value },
    fieldState: { error }
  }: UseControllerReturn) => {
    const handleDateSelected = (state: boolean) => {
      onCheckedCb(state);
      onChange(state);
    };

    return (
      <>
        <FiltersSelectorItem
          onCheckedCb={handleDateSelected}
          checked={value}
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

export default FormikFiltersSelectorItem;
