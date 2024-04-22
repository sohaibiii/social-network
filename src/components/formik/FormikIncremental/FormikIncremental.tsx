import React, { memo, useMemo } from "react";
import { TouchableOpacity, View } from "react-native";

import isEqual from "react-fast-compare";
import { Controller, UseControllerReturn } from "react-hook-form";
import { HelperText, useTheme } from "react-native-paper";
import { useSelector } from "react-redux";

import formikIncrementalStyle from "./FormikIncremental.style";
import { FormikIncrementalProps } from "./FormikIncremental.types";

import { RootState } from "~/redux/store";

import { CText, Icon, IconTypes } from "~/components/";
import { scale } from "~/utils/responsivityUtil";

const FormikIncremental = (props: FormikIncrementalProps): JSX.Element => {
  const {
    name = "",
    defaultValue = 0,
    control,
    handleOnCountIncreasedCb = () => undefined,
    handleOnCountDecreasedCb = () => undefined,
    title = "",
    description = "",
    minValue = 0,
    maxValue = 9,
    stepCount = 1,
    style = {},
    isSmall = false
  } = props;

  const { colors } = useTheme();
  const isThemeDark = useSelector(
    (reduxState: RootState) => reduxState.settings.isThemeDark
  );

  const { container, row, textContainerStyle, countTextStyle } = useMemo(
    () => formikIncrementalStyle(isSmall),
    [isSmall]
  );

  const containerStyles = useMemo(() => [container, style], [container, style]);

  const render = ({
    field: { onChange, value },
    fieldState: { error }
  }: UseControllerReturn) => {
    const handleDecreaseCount = () => {
      handleOnCountDecreasedCb(value - stepCount);
      onChange(value - stepCount);
    };

    const handleIncreaseCount = () => {
      handleOnCountIncreasedCb(value + stepCount);
      onChange(value + stepCount);
    };

    const decrementIsDisabled = value < minValue + stepCount;

    const incrementIsDisabled = value > maxValue - stepCount;

    const disabledColor = isThemeDark ? colors.grayEE : colors.gray;

    return (
      <>
        <View style={containerStyles}>
          <View style={textContainerStyle}>
            <CText color={"text"} fontSize={14} fontFamily={"regular"}>
              {title}
            </CText>
            {!!description && (
              <CText color={"gray"} fontSize={11} fontFamily={"light"}>
                {description}
              </CText>
            )}
          </View>
          <View style={row}>
            <TouchableOpacity
              disabled={decrementIsDisabled}
              onPress={handleDecreaseCount}
            >
              <Icon
                type={IconTypes.MATERIAL_COMMUNITY_ICONS}
                color={decrementIsDisabled ? disabledColor : colors.text}
                size={scale(25)}
                name={"minus-circle-outline"}
              />
            </TouchableOpacity>
            <CText
              lineHeight={24}
              textAlign={"center"}
              color={"text"}
              fontSize={16}
              style={countTextStyle}
              fontFamily={"light"}
            >
              {value}
            </CText>
            <TouchableOpacity
              disabled={incrementIsDisabled}
              onPress={handleIncreaseCount}
            >
              <Icon
                type={IconTypes.MATERIAL_COMMUNITY_ICONS}
                color={incrementIsDisabled ? disabledColor : colors.text}
                size={scale(25)}
                name={"plus-circle-outline"}
              />
            </TouchableOpacity>
          </View>
        </View>
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

export default memo(FormikIncremental, isEqual);
