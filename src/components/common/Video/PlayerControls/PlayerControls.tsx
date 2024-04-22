import React, { memo } from "react";
import { View, TouchableOpacity } from "react-native";

import { useTheme } from "react-native-paper";

import styles from "./PlayerControls.styles";
import { PlayerControlsType } from "./PlayerControls.types";

import { Icon, IconTypes } from "~/components/common";

const PlayerControls = (props: PlayerControlsType): JSX.Element => {
  const {
    playing,
    showPreviousAndNext,
    showSkip,
    previousDisabled,
    nextDisabled,
    onPlay,
    onPause,
    skipForwards,
    skipBackwards,
    onNext,
    onPrevious
  } = props;
  const theme = useTheme();

  const { videoIconStyle, wrapper, touchableDisabled, touchable, playStopIconStyle } =
    styles(theme);

  const playStopIconStyles = [videoIconStyle, playStopIconStyle];

  return (
    <View style={wrapper}>
      {showPreviousAndNext && (
        <TouchableOpacity
          style={[touchable, previousDisabled && touchableDisabled]}
          onPress={onPrevious}
          disabled={previousDisabled}
        >
          <Icon type={IconTypes.ANT_DESIGN} name="stepbackward" style={videoIconStyle} />
        </TouchableOpacity>
      )}

      {showSkip && (
        <TouchableOpacity style={touchable} onPress={skipBackwards}>
          <Icon type={IconTypes.MATERIAL_ICONS} name="replay-10" style={videoIconStyle} />
        </TouchableOpacity>
      )}

      <TouchableOpacity style={touchable} onPress={playing ? onPause : onPlay}>
        <Icon
          type={IconTypes.MATERIAL_ICONS}
          name={playing ? "pause-circle-filled" : "play-circle-filled"}
          style={playStopIconStyles}
        />
      </TouchableOpacity>

      {showSkip && (
        <TouchableOpacity style={touchable} onPress={skipForwards}>
          <Icon
            type={IconTypes.MATERIAL_ICONS}
            name="forward-10"
            style={videoIconStyle}
          />
        </TouchableOpacity>
      )}

      {showPreviousAndNext && (
        <TouchableOpacity
          style={[touchable, nextDisabled && touchableDisabled]}
          onPress={onNext}
          disabled={nextDisabled}
        >
          <Icon type={IconTypes.ANT_DESIGN} name="stepforward" style={videoIconStyle} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(PlayerControls);
