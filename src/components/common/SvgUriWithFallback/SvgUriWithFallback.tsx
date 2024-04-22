import React, { memo, useState } from "react";

import isEqual from "react-fast-compare";
import { SvgUri } from "react-native-svg";

import { SvgUriWithFallbackType } from "./SvgUriWithFallback.types";

const SvgUriWithFallback = memo((props: SvgUriWithFallbackType): JSX.Element => {
  const { fallbackIcon = "", ...restOfProps } = props;

  const [hasError, setHasError] = useState(false);
  const handleOnError = () => {
    setHasError(true);
  };
  return (
    <>
      {hasError ? (
        fallbackIcon
      ) : (
        <SvgUri fallbackIcon {...restOfProps} onError={handleOnError} />
      )}
    </>
  );
}, isEqual);

SvgUriWithFallback.displayName = "SvgUriWithFallback";

export { SvgUriWithFallback };
