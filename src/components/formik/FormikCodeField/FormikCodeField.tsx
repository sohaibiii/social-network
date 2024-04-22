import React from "react";
import { NativeSyntheticEvent, TextInputKeyPressEventData, View } from "react-native";

import { Controller } from "react-hook-form";
import { useTheme } from "react-native-paper";
import { useSelector } from "react-redux";

import { FormikCodeFieldType } from "./FormikCodeField.types";

import { RootState } from "~/redux/store";

import { FormikTextInput } from "~/components/formik";
import formikCodeFieldStyle from "~/components/formik/FormikCodeField/FormikCodeField.style";

const FormikCodeField = (props: FormikCodeFieldType): JSX.Element => {
  const {
    name = "",
    defaultValue,
    control,
    onChangeTextCb = () => undefined,
    mode = "flat",
    errorWithNoMessage = false,
    setFocus = () => undefined,
    register,
    keyboardType
  } = props;
  const { language } = useSelector((state: RootState) => state.settings);

  const { colors } = useTheme();
  const textInputTheme = useTheme({
    colors: {
      placeholder: colors.grayReversed,
      text: colors.grayReversed,
      primary: colors.primary
    }
  });

  const handleCodeChange = (text: string, codeFieldToFocus: string) => {
    if (text.length > 0) {
      setFocus(codeFieldToFocus);
    }
  };

  const handleCodeBackspacePressed = (
    { nativeEvent }: NativeSyntheticEvent<TextInputKeyPressEventData>,
    codeFieldToFocus: string
  ) => {
    if (nativeEvent.key === "Backspace") {
      setFocus(codeFieldToFocus);
    }
  };

  const handleCode6ChangeText = (text: string) => {
    if (text.length > 0) {
      if (onChangeTextCb) {
        onChangeTextCb(text);
      }
    }
  };

  const { containerStyle, codeContainerStyle, codeInputStyle } = formikCodeFieldStyle(
    colors,
    language
  );
  const render = () => {
    return (
      <View style={containerStyle}>
        <FormikTextInput
          control={control}
          name={"code1"}
          register={register}
          mode={mode}
          textInputContainerStyle={codeContainerStyle}
          style={codeInputStyle}
          maxLength={1}
          selectTextOnFocus
          errorVisible={false}
          onChangeTextCb={text => handleCodeChange(text, "code2")}
          errorWithNoMessage={errorWithNoMessage}
          underlineColorAndroid={colors.primary}
          underlineColor={colors.primary}
          theme={textInputTheme}
          testID="codeFieldID"
          keyboardType={keyboardType}
        />
        <FormikTextInput
          control={control}
          name={"code2"}
          register={register}
          mode={mode}
          textInputContainerStyle={codeContainerStyle}
          style={codeInputStyle}
          maxLength={1}
          selectTextOnFocus
          errorVisible={false}
          onKeyPress={e => handleCodeBackspacePressed(e, "code1")}
          onChangeTextCb={text => handleCodeChange(text, "code3")}
          errorWithNoMessage={errorWithNoMessage}
          underlineColorAndroid={colors.primary}
          underlineColor={colors.primary}
          theme={textInputTheme}
          testID="codeFieldID"
          keyboardType={keyboardType}
        />
        <FormikTextInput
          control={control}
          name={"code3"}
          register={register}
          mode={mode}
          textInputContainerStyle={codeContainerStyle}
          style={codeInputStyle}
          maxLength={1}
          selectTextOnFocus
          errorVisible={false}
          onKeyPress={e => handleCodeBackspacePressed(e, "code2")}
          onChangeTextCb={text => handleCodeChange(text, "code4")}
          errorWithNoMessage={errorWithNoMessage}
          underlineColorAndroid={colors.primary}
          underlineColor={colors.primary}
          theme={textInputTheme}
          testID="codeFieldID"
          keyboardType={keyboardType}
        />
        <FormikTextInput
          control={control}
          name={"code4"}
          register={register}
          mode={mode}
          textInputContainerStyle={codeContainerStyle}
          maxLength={1}
          selectTextOnFocus
          errorVisible={false}
          style={codeInputStyle}
          onKeyPress={e => handleCodeBackspacePressed(e, "code3")}
          onChangeTextCb={text => handleCodeChange(text, "code5")}
          errorWithNoMessage={errorWithNoMessage}
          underlineColorAndroid={colors.primary}
          underlineColor={colors.primary}
          theme={textInputTheme}
          testID="codeFieldID"
          keyboardType={keyboardType}
        />
        <FormikTextInput
          control={control}
          name={"code5"}
          register={register}
          mode={mode}
          textInputContainerStyle={codeContainerStyle}
          style={codeInputStyle}
          maxLength={1}
          selectTextOnFocus
          errorVisible={false}
          onKeyPress={e => handleCodeBackspacePressed(e, "code4")}
          onChangeTextCb={text => handleCodeChange(text, "code6")}
          errorWithNoMessage={errorWithNoMessage}
          underlineColorAndroid={colors.primary}
          underlineColor={colors.primary}
          theme={textInputTheme}
          testID="codeFieldID"
          keyboardType={keyboardType}
        />
        <FormikTextInput
          control={control}
          name={"code6"}
          register={register}
          mode={mode}
          textInputContainerStyle={codeContainerStyle}
          style={codeInputStyle}
          maxLength={1}
          selectTextOnFocus
          errorVisible={false}
          onKeyPress={e => handleCodeBackspacePressed(e, "code5")}
          onChangeTextCb={handleCode6ChangeText}
          errorWithNoMessage={errorWithNoMessage}
          underlineColorAndroid={colors.primary}
          underlineColor={colors.primary}
          theme={textInputTheme}
          testID="codeFieldID"
          keyboardType={keyboardType}
        />
      </View>
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
export default FormikCodeField;
