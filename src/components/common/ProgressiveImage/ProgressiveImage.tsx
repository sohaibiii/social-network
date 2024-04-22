import React, { useState, memo, useCallback, useMemo } from "react";
import { View } from "react-native";

import isEqual from "react-fast-compare";
import FastImage from "react-native-fast-image";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";

import progressiveImageStyle from "./ProgressiveImage.style";

import IMAGES from "~/assets/images";
import {
  ProgressiveImageType,
  FastImageType
} from "~/components/common/ProgressiveImage/ProgressiveImage.types";

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

const ProgressiveImage = (props: ProgressiveImageType & FastImageType): JSX.Element => {
  const {
    style = {},
    source,
    loadingSource,
    thumbnailSource = IMAGES.placeholder,
    errorSource,
    loadingImageComponent,
    blurRadius = 15,
    imageAnimationDuration = 1000,
    thumbnailAnimationDuration = 200,
    ...restOfProps
  } = props;

  const animatedImage = useSharedValue(0);
  const animatedThumbnailImage = useSharedValue(0);
  const animatedLoadingImage = useSharedValue(1);

  const [error, setError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleOnFinished = (isFinished: boolean) => {
    isFinished &&
      (animatedThumbnailImage.value = withTiming(1, {
        duration: thumbnailAnimationDuration
      }));
  };
  const handleOnImageLoaded = useCallback(
    (isFinished: boolean) => {
      isFinished && (animatedThumbnailImage.value = withTiming(0));
    },
    [animatedThumbnailImage]
  );

  const onThumbnailLoad = () => {
    animatedLoadingImage.value = withTiming(0, {}, isFinished =>
      runOnJS(handleOnFinished)(isFinished)
    );
  };

  const onImageLoad = useCallback(() => {
    setImageLoaded(false);
    animatedImage.value = withTiming(
      1,
      {
        duration: imageAnimationDuration
      },
      isFinished => runOnJS(handleOnImageLoaded)(isFinished)
    );
  }, [animatedImage, handleOnImageLoaded, imageAnimationDuration]);

  const onError = useCallback(() => {
    setError(true);
  }, []);

  const getNormalisedSource = () => {
    const normalisedSource =
      !!source && typeof source.uri === "string" && !source.uri.split("http")[1]
        ? errorSource
        : source;

    return (!!source && source.uri ? normalisedSource : source) || source;
  };

  const statedSource = () => {
    if (!loadingSource) {
      return error ? errorSource : getNormalisedSource();
    }
    if (!errorSource) return getNormalisedSource();
    return error
      ? errorSource // ? Error Image
      : getNormalisedSource();
  };

  const { imageStyle, container, loadingImageStyle } = progressiveImageStyle;
  const animatedLoadingImageStyle = useAnimatedStyle(() => {
    return { opacity: animatedLoadingImage.value };
  });

  const animatedThumbnailImageStyle = useAnimatedStyle(() => {
    return { opacity: animatedThumbnailImage.value };
  });

  const animatedFastImageStyle = useAnimatedStyle(() => {
    return { opacity: animatedImage.value };
  });

  const animatedLoadingImageStyles = [
    animatedLoadingImageStyle,
    loadingImageStyle,
    style
  ];
  const animatedThumbnailImageStyles = useMemo(
    () => [imageStyle, animatedThumbnailImageStyle, style],
    [imageStyle, animatedThumbnailImageStyle, style]
  );
  const animatedFastImageStyles = useMemo(
    () => [imageStyle, animatedFastImageStyle, style],
    [imageStyle, animatedFastImageStyle, style]
  );

  const animatedLoadingStyles = useMemo(
    () => [loadingImageStyle, style],
    [loadingImageStyle, style]
  );

  return (
    <View style={[container, style]}>
      {loadingImageComponent ||
        (loadingSource && !imageLoaded && (
          <View style={animatedLoadingStyles}>
            <AnimatedFastImage
              resizeMode="contain"
              style={animatedLoadingImageStyles}
              source={loadingSource}
            />
          </View>
        ))}
      <Animated.Image
        {...restOfProps}
        blurRadius={blurRadius}
        source={thumbnailSource}
        onLoad={onThumbnailLoad}
        style={animatedThumbnailImageStyles}
      />
      <AnimatedFastImage
        {...restOfProps}
        onError={onError}
        onLoad={onImageLoad}
        style={animatedFastImageStyles}
        source={statedSource()}
      />
    </View>
  );
};
export default memo(ProgressiveImage, isEqual);
