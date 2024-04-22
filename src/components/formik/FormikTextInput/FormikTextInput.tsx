import React from "react";

import { Control, Controller, UseControllerReturn } from "react-hook-form";

import { FormikTextInputType } from "./FormikTextInput.types";

import { TextInput } from "~/components/common";

const FormikTextInput = (
  props: FormikTextInputType & {
    control?: Control<Record<string, string>>;
  }
): JSX.Element => {
  const {
    name = "",
    defaultValue,
    control,
    register,
    onChangeTextCb = () => undefined,
    errorVisible = true,
    regex,
    shouldTrim = false,
    onRegexFail = () => undefined,
    ...restOfProps
  } = props;

  const render = ({
    field: { onChange, onBlur, value },
    fieldState: { error }
  }: UseControllerReturn) => {
    const handleTextChanged = (text: string) => {
      if (!regex || text.length === 0 || text.match(regex)) {
        const newText = shouldTrim ? text?.trim() : text;
        onChangeTextCb(newText);
        onChange(newText);
      } else {
        onRegexFail();
      }
    };

    return (
      <TextInput
        onChangeText={handleTextChanged}
        onBlur={onBlur}
        value={value}
        error={error?.message}
        errorVisible={errorVisible}
        name={name}
        register={register}
        {...restOfProps}
      />
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
export default FormikTextInput;
