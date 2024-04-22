import React, { useMemo } from "react";

import { useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { RatingComponentProps } from "./RatingComponent.types";

import ratingComponentStyle from "~/components/common/RatingBar/RatingComponent/RatingComponent.style";

const RatingComponent = (props: RatingComponentProps): JSX.Element => {
  const { colors } = useTheme();
  const {
    isChecked = false,
    type = "heart",
    size = 30,
    testID = "",
    spacing = 0,
    ...restOfProps
  } = props;

  const { container } = ratingComponentStyle;
  const iconStyle = useMemo(() => container(spacing), [container, spacing]);

  return (
    <Icon
      name={type}
      size={size}
      style={iconStyle}
      color={isChecked ? colors.orange : colors.gray}
      testID={testID}
      {...restOfProps}
    />
  );
};

export default RatingComponent;
