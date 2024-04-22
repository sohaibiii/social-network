import React, { useState, useCallback, useMemo, forwardRef, memo } from "react";
import { View } from "react-native";

import isEqual from "react-fast-compare";
import FastImage from "react-native-fast-image";
import { useTheme, ActivityIndicator } from "react-native-paper";
import VideoPlayer from "react-native-video";
import { useSelector, shallowEqual } from "react-redux";

import { iosStyles } from "./VideoPlayer.styles";
import { VideoPlayerRef, VideoPlayerType } from "./VideoPlayer.types";

import { RootState } from "~/redux/store";

import { PLATFORM } from "~/constants/";
import { errorLogFormatter, logError } from "~/utils/";

const VideoPlayerComponent: React.ForwardRefRenderFunction<
  VideoPlayerRef,
  VideoPlayerType
> = (props: VideoPlayerType, forwardedRef): JSX.Element => {
  const theme = useTheme();

  const [isVideoBuffering, setIsVideoBuffering] = useState(true);

  const autoplay_video = useSelector(
    (state: RootState) => state.auth?.userProfile?.preferences?.autoplay_video,
    shallowEqual
  );

  const {
    source,
    paused,
    videoStyle = {},
    controls = true,
    resizeMode = "cover",
    onLoadEndCb = () => {},
    fullscreen = false,
    repeat = false,
    muted = false,
    poster,
    posterResizeMode = "cover",
    onLoad = () => {},
    isFromGallery = false,
    ...restOfProps
  } = props;

  const onLoadEnd = useCallback(() => {
    setIsVideoBuffering(false);
    onLoadEndCb();
  }, [onLoadEndCb]);

  const handleOnError = useCallback(
    error => {
      logError(
        `Error: handleOnError --VideoPlayer.tsx-- uri=${source.uri} ${errorLogFormatter(
          error
        )}`
      );
    },
    [source]
  );

  const { backgroundVideo, loaderStyle, thumbnailStyle, thumbnailContainerStyle } =
    useMemo(() => iosStyles(theme), [theme]);

  const posterUri = useMemo(() => ({ uri: poster }), [poster]);
  const isAutoPlay = useMemo(
    () => (typeof autoplay_video === "boolean" ? autoplay_video : true),
    [autoplay_video]
  );
  const videoStyles = useMemo(
    () => [backgroundVideo, videoStyle],
    [backgroundVideo, videoStyle]
  );

  const key = useMemo(() => `${controls}-${source.uri}`, [controls, source?.uri]);

  const onLoadStart = useCallback(() => {
    if (PLATFORM === "android") {
      setIsVideoBuffering(true);
    }
  }, []);
  return (
    <>
      <VideoPlayer
        ref={forwardedRef}
        key={key}
        source={source}
        controls={controls}
        style={videoStyles}
        resizeMode={resizeMode}
        onReadyForDisplay={onLoadEnd}
        onLoadStart={onLoadStart}
        onError={handleOnError}
        paused={paused}
        repeat={repeat}
        fullscreen={fullscreen}
        muted={muted}
        onLoad={onLoad}
        {...restOfProps}
      />
      {((PLATFORM === "android" && !isFromGallery && paused) ||
        (isVideoBuffering && (isAutoPlay || isFromGallery))) && (
        <View style={thumbnailContainerStyle}>
          <FastImage
            source={posterUri}
            style={thumbnailStyle}
            resizeMode={posterResizeMode}
          />
        </View>
      )}

      {isVideoBuffering && (isAutoPlay || isFromGallery) && (
        <View style={loaderStyle}>
          <ActivityIndicator color={theme.colors.white} />
        </View>
      )}
    </>
  );
};

export default memo(forwardRef(VideoPlayerComponent), isEqual);
