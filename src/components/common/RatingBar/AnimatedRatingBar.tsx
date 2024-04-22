import React, { useState } from "react";
import { View } from "react-native";

import AnimatedRatingComponent from "./AnimatedRatingComponent/AnimatedRatingComponent";
import ratingBarStyle from "./RatingBar.style";
import { RadioBarProps } from "./RatingBar.types";

const RatingBar = (props: RadioBarProps): JSX.Element => {
  const {
    onToggleCb,
    ratingCount = 5,
    size = 30,
    type = "star",
    testID = "",
    defaultValue,
    disabled = false,
    containerStyle = {},
    ...restOfProps
  } = props;
  const [currentRating, setCurrentRating] = useState(defaultValue ?? 3);

  const onChangeRating = (value: number) => {
    if (disabled) return;

    if (onToggleCb) {
      onToggleCb(value);
    }
    setCurrentRating(value);
  };

  const ratings = Array.from({ length: ratingCount }, (_, i) => i);
  const { container } = ratingBarStyle;
  const containerStyles = [container, containerStyle];

  return (
    <View style={containerStyles} {...restOfProps} testID={testID}>
      {ratings.map(rating => (
        <AnimatedRatingComponent
          key={rating}
          onPress={() => onChangeRating(rating + 1)}
          currentRating={currentRating}
          size={size}
          type={type}
          isChecked={currentRating > rating}
        />
      ))}
    </View>
  );
};

export default RatingBar;
