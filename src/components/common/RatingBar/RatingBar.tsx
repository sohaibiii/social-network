import React, { memo, useState, useMemo, useCallback } from "react";
import { TouchableOpacity, View } from "react-native";

import isEqual from "react-fast-compare";

import ratingBarStyle from "./RatingBar.style";
import { RadioBarProps } from "./RatingBar.types";
import RatingComponent from "./RatingComponent/RatingComponent";

const RatingBar = (props: RadioBarProps): JSX.Element => {
  const {
    onToggleCb,
    ratingCount = 5,
    size = 30,
    type = "star",
    testID = "",
    defaultValue = 0,
    disabled = false,
    useCeil = false,
    containerStyle = {},
    spacing = 0,
    ...restOfProps
  } = props;

  const editDefaultValue = useCeil ? Math.ceil(defaultValue) : Math.floor(defaultValue);
  const [currentRating, setCurrentRating] = useState(editDefaultValue);

  const onChangeRating = useCallback(
    (value: number) => {
      if (disabled) return;

      if (onToggleCb) {
        onToggleCb(value);
      }
      setCurrentRating(value);
    },
    [disabled, onToggleCb]
  );

  const ratings = useMemo(
    () => Array.from({ length: ratingCount }, (_, i) => i),
    [ratingCount]
  );
  const { container } = useMemo(() => ratingBarStyle, []);
  const containerStyles = useMemo(
    () => [container, containerStyle],
    [container, containerStyle]
  );

  return (
    <View
      pointerEvents={disabled ? "none" : "auto"}
      style={containerStyles}
      {...restOfProps}
      testID={testID}
    >
      {ratings.map(rating => (
        <TouchableOpacity
          key={rating}
          activeOpacity={disabled ? 1 : 0.7}
          disabled={disabled}
          onPress={!disabled ? () => onChangeRating(rating) : undefined}
        >
          <RatingComponent
            size={size}
            type={type}
            isChecked={currentRating > rating}
            spacing={spacing}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default memo(RatingBar, isEqual);
