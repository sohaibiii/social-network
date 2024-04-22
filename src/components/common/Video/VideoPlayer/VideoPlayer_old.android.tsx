import React, { useState, useRef, useEffect, memo, useCallback, useMemo } from "react";
import { View, TouchableWithoutFeedback, TouchableOpacity } from "react-native";

import Modal from "react-native-modal";
import { OrientationType, PORTRAIT } from "react-native-orientation-locker";
import { useTheme, ActivityIndicator, Portal } from "react-native-paper";
import VideoPlayer, { VideoProperties } from "react-native-video";

import { PlayerControls, ProgressBar } from "../";

import { androidStyles } from "./VideoPlayer.styles";
import { VideoPlayerType } from "./VideoPlayer.types";

import { Icon, IconTypes } from "~/components/common";
import { APP_SCREEN_WIDTH } from "~/constants/";
import { errorLogFormatter, logError } from "~/utils/";

const VideoPlayerComponent = (props: VideoPlayerType) => {
  const {
    source,
    paused = false,
    videoStyle = {},
    controls = true,
    resizeMode = "contain",
    onLoadEndCb = () => {},
    repeat = false,
    muted = false,
    poster,
    posterResizeMode = "cover",
    onLoad = () => {},
    orientation
  } = props;
  const theme = useTheme();

  // video state
  const [fullscreen, setFullscreen] = useState(false);
  const [isVideoPlaying, setVideoPlaying] = useState(!paused);
  const [videoControls, setVideoControls] = useState(controls && !paused);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isVideoBuffering, setIsVideoBuffering] = useState(true);

  const videoPlayerRef = useRef<VideoProperties>();

  const handleFullscreen = useCallback(() => {
    setFullscreen(oldFullScreenValue => !oldFullScreenValue);
  }, []);

  const handlePlayPause = useCallback(() => {
    // If playing, pause and show controls immediately.
    if (isVideoPlaying) {
      setVideoPlaying(false);
      setVideoControls(!!controls);
      return;
    }
    setVideoPlaying(true);
    setTimeout(() => setVideoControls(false), 2000);
  }, [isVideoPlaying, controls]);

  const skipBackward = useCallback(() => {
    const newTime = Math.max(videoCurrentTime - 10, 0);
    videoPlayerRef.current.seek(newTime);
    setVideoCurrentTime(newTime);
  }, [videoCurrentTime]);

  const skipForward = useCallback(() => {
    const newTime = Math.min(videoCurrentTime + 10, videoDuration);
    videoPlayerRef.current.seek(newTime);
    setVideoCurrentTime(newTime);
  }, [videoCurrentTime, videoDuration]);

  const onSeek = useCallback(data => {
    videoPlayerRef.current.seek(data.seekTime);
    setVideoCurrentTime(data.seekTime);
  }, []);

  const onProgress = useCallback(({ currentTime, seekableDuration }) => {
    setVideoCurrentTime(currentTime);
  }, []);

  const onEnd = useCallback(() => {
    setVideoPlaying(false);
    videoPlayerRef.current.seek(0);
  }, []);

  const showControls = useCallback(e => {
    setVideoControls(oldVideoControls => !oldVideoControls);
  }, []);

  const handleOnError = useCallback(
    error => {
      logError(
        `Error: handleOnError --VideoPlayer_old_android.tsx-- uri=${
          source.uri
        } ${errorLogFormatter(error)}`
      );
    },
    [source]
  );

  const handleOnLoad = useCallback(
    data => {
      videoPlayerRef?.current?.seek(videoCurrentTime);
      onLoad(data);
      if (Object.keys(data).length === 0) {
        return;
      }

      setVideoDuration(data.duration);
      setIsVideoBuffering(false);
      onLoadEndCb();
    },
    [onLoad, onLoadEndCb]
  );

  useEffect(() => {
    setVideoPlaying(!paused);
    setVideoControls(!!controls && !paused);
    return () => {};
  }, [paused, controls]);

  const {
    backgroundVideo,
    videoWrapperStyle,
    fullscreenButton,
    controlOverlay,
    videoIconStyle,
    hitSlopStyle,
    backgroundVideoFullScreenStyle,
    videoWrapperFullScreenStyle,
    loaderStyle,
    modalStyle,
    progressBarStyle,
    progressBarLandscapeStyle,
    flexGrow,
    videoPlayerWrapperStyle
  } = androidStyles(theme);

  const progressBarStyles =
    orientation === PORTRAIT ? progressBarStyle : progressBarLandscapeStyle;

  const modalStyles = [
    modalStyle,
    fullscreen ? backgroundVideoFullScreenStyle : backgroundVideo
  ];

  const containerStyles = fullscreen
    ? videoWrapperFullScreenStyle
    : Object.keys(videoStyle).length > 0
    ? [videoWrapperStyle, videoStyle]
    : videoWrapperStyle;

  const handleBackButtonPress = () => {
    setFullscreen(false);
  };

  const ProgressBarContainer = fullscreen ? View : Portal;
  return (
    <View style={containerStyles}>
      <Modal
        onBackButtonPress={fullscreen && handleBackButtonPress}
        isVisible
        style={modalStyles}
        hasBackdrop={!!fullscreen}
        customBackdrop={<View style={flexGrow} />}
        backdropOpacity={1}
        coverScreen={!!fullscreen}
      >
        <TouchableWithoutFeedback disabled={!controls} onPress={showControls}>
          <View style={videoPlayerWrapperStyle}>
            <VideoPlayer
              source={source}
              ref={videoPlayerRef}
              style={fullscreen ? backgroundVideoFullScreenStyle : backgroundVideo}
              controls={false}
              resizeMode={fullscreen ? "contain" : resizeMode}
              onProgress={onProgress}
              onEnd={onEnd}
              onLoad={handleOnLoad}
              paused={!isVideoPlaying}
              repeat={repeat}
              muted={muted}
              poster={poster}
              posterResizeMode={fullscreen ? "contain" : posterResizeMode}
              onError={handleOnError}
            />
            {isVideoBuffering && (
              <View style={loaderStyle}>
                <ActivityIndicator color={theme.colors.white} />
              </View>
            )}
            {!isVideoBuffering && videoControls && (
              <View style={controlOverlay}>
                <TouchableOpacity
                  onPress={handleFullscreen}
                  hitSlop={hitSlopStyle}
                  style={fullscreenButton}
                >
                  <Icon
                    type={IconTypes.MATERIAL_COMMUNITY_ICONS}
                    name={fullscreen ? "fullscreen-exit" : "fullscreen"}
                    style={videoIconStyle}
                  />
                </TouchableOpacity>
                <PlayerControls
                  onPlay={handlePlayPause}
                  onPause={handlePlayPause}
                  playing={isVideoPlaying}
                  showPreviousAndNext={false}
                  showSkip={true}
                  skipBackwards={skipBackward}
                  skipForwards={skipForward}
                />
                <ProgressBarContainer>
                  <View style={progressBarStyles}>
                    <ProgressBar
                      currentTime={videoCurrentTime}
                      duration={videoDuration > 0 ? videoDuration : 0}
                      onSlideStart={handlePlayPause}
                      onSlideComplete={handlePlayPause}
                      onSlideCapture={onSeek}
                    />
                  </View>
                </ProgressBarContainer>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
export default memo(VideoPlayerComponent);
