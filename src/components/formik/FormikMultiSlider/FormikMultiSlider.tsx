import React from "react";

import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { Controller, UseControllerReturn } from "react-hook-form";
import { HelperText } from "react-native-paper";

import { FormikMultiSliderProps } from "./FormikMultiSlider.types";

import { CText } from "~/components/";
import formikMultiSliderStyle from "~/components/formik/FormikMultiSlider/FormikMultiSlider.style";

const FormikMultiSlider = (props: FormikMultiSliderProps): JSX.Element => {
  const {
    name = "",
    defaultValue = [0],
    control,
    topLabel = () => undefined,
    onValuesChangeFinishCb = () => undefined,
    ...restOfProps
  } = props;

  const { multiSliderContainerStyle } = formikMultiSliderStyle;

  const render = ({
    field: { onChange, value },
    fieldState: { error }
  }: UseControllerReturn) => {
    const handleToggled = (values: number[]) => {
      onValuesChangeFinishCb(values);
      onChange(values);
    };

    return (
      <>
        {!!topLabel && (
          <CText fontSize={14} lineHeight={19}>
            {topLabel(value)}
          </CText>
        )}
        <MultiSlider
          values={value}
          containerStyle={multiSliderContainerStyle}
          onValuesChangeFinish={handleToggled}
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

export default FormikMultiSlider;
