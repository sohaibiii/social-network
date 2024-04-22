import React, { memo, useState, useCallback, useEffect, useRef, useMemo } from "react";
import { View, TouchableOpacity } from "react-native";

import isEqual from "react-fast-compare";
import { useTheme } from "react-native-paper";
import convertToProxyURL from "react-native-video-cache";
import { useSelector, shallowEqual } from "react-redux";

import styles from "./VideoPreview.styles";
import { VideoPreviewProps } from "./VideoPreview.types";

import { RootState } from "~/redux/store";

import { VideoPlayer, Icon, IconTypes } from "~/components/common";
import { InViewport } from "~/components/common";
import { scale } from "~/utils/responsivityUtil";

const VideoPreview = (props: VideoPreviewProps): JSX.Element => {
  const theme = useTheme();
  const { uri, thumbnail, resizeMode = "cover", posterResizeMode = "cover" } = props;

  const isGalleryVisible = useSelector(
    (state: RootState) => state.galleryViewer.isVisible
  );

  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(true);
  const isMounted = useRef(false);

  const autoplay_video = useSelector(
    (state: RootState) => state.auth?.userProfile?.preferences?.autoplay_video,
    shallowEqual
  );

  useEffect(() => {
    isMounted.current = true;

    return () => (isMounted.current = false);
  }, []);

  const handleMuteUnmutePressed = useCallback(() => {
    setIsMuted(oldIsMute => !oldIsMute);
  }, []);

  const handlePlaying = useCallback(
    isInViewport => {
      // typeof autoplay_video boolean means user logged then read value else always autoplay video
      if (isMounted.current) {
        if (typeof autoplay_video === "boolean") {
          setIsPaused(!isInViewport || !autoplay_video || isGalleryVisible);
        } else {
          setIsPaused(!isInViewport || isGalleryVisible);
        }
      }
    },
    [autoplay_video, isGalleryVisible]
  );

  const source = useMemo(() => ({ uri: convertToProxyURL(uri) }), [uri]);

  const { videoMuteWrapperStyles, videoMuteBackgroundWrapperStyle } = useMemo(
    () => styles(theme),
    [theme]
  );

  return (
    <InViewport onChange={handlePlaying} useFullWidth>
      <VideoPlayer
        source={source}
        resizeMode={resizeMode}
        poster={thumbnail}
        posterResizeMode={posterResizeMode}
        paused={isPaused}
        controls={false}
        muted={isMuted}
      />
      <TouchableOpacity onPress={handleMuteUnmutePressed} style={videoMuteWrapperStyles}>
        <View style={videoMuteBackgroundWrapperStyle}>
          <Icon
            type={IconTypes.SAFARWAY_ICONS}
            name={isMuted ? "mute" : "unmute"}
            disabled
            width={scale(24)}
            height={scale(24)}
            color={theme.colors.white}
          />
        </View>
      </TouchableOpacity>
    </InViewport>
  );
};

export default memo(VideoPreview, isEqual);
