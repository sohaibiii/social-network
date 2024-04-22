import React, { memo } from "react";

import isEqual from "react-fast-compare";

import { SafIconProps } from "./SafIcon.types";

import ICONS from "~/assets/icons";

const SafIcon = (props: SafIconProps): JSX.Element => {
  const { name, testID = "", ...restOfProps } = props;
  const IconComp = name in ICONS ? ICONS[name] : null;

  if (!IconComp) return <></>;

  return <IconComp testID={testID} {...restOfProps} />;
};

export default memo(SafIcon, isEqual);
