import React, { memo, useMemo, useCallback } from "react";
import { TouchableHighlight, TouchableOpacity, View, Image } from "react-native";

import isEqual from "react-fast-compare";
import { useTheme } from "react-native-paper";

import ImagePreviewItemStyle from "./ImagePreviewItem.style";
import { ImagePreviewItemType } from "./ImagePreviewItem.types";

import { Icon, IconTypes } from "~/components/common";
import { scale } from "~/utils/";

const UserRow = (props: ImagePreviewItemType): JSX.Element => {
  const { image, onPress = () => {}, size = scale(70) } = props;
  const { colors } = useTheme();

  const { container, closeOverlayStyle, closeIconStyle, progressiveImageStyle } = useMemo(
    () => ImagePreviewItemStyle(colors, size),
    [colors, size]
  );
  const source = useMemo(
    () => ({ uri: image.type?.includes("video") ? image?.thumbnail : image?.uri }),
    [image?.thumbnail, image.type, image?.uri]
  );

  const handleOnPress = useCallback(() => {
    onPress(image);
  }, [image, onPress]);

  return (
    <TouchableHighlight>
      <View style={container}>
        <View style={closeOverlayStyle}>
          <TouchableOpacity onPress={handleOnPress}>
            <Icon
              style={closeIconStyle}
              type={IconTypes.MATERIAL_COMMUNITY_ICONS}
              size={scale(14)}
              name={"close"}
              color={"white"}
            />
          </TouchableOpacity>
        </View>
        <Image style={progressiveImageStyle} source={source} />
      </View>
    </TouchableHighlight>
  );
};
export default memo(UserRow, isEqual);
