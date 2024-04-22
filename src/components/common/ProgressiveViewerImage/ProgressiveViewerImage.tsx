import React from "react";
import { TouchableOpacity } from "react-native";

import { useDispatch } from "react-redux";

import { ProgressiveViewerImageType } from "./ProgressiveViewerImage.types";

import IMAGES from "~/assets/images";
import { ProgressiveImage } from "~/components/common";
import { showGalleryViewer } from "~/redux/reducers/galleryViewer.reducer";

const ProgressiveViewerImage = (props: ProgressiveViewerImageType): JSX.Element => {
  const { source, wrapperStyle, imageStyle, borderRadius, ...restOfParams } = props;
  const dispatch = useDispatch();

  const handleEnterFullScreenImageViewer = () => {
    dispatch(
      showGalleryViewer({
        data: [source],
        isVisible: true,
        disableThumbnailPreview: true,
        currentIndex: 0
      })
    );
  };

  return (
    <TouchableOpacity style={wrapperStyle} onPress={handleEnterFullScreenImageViewer}>
      <ProgressiveImage
        borderRadius={borderRadius}
        style={imageStyle}
        thumbnailSource={IMAGES.user_profile_default}
        errorSource={IMAGES.user_profile_default}
        source={source}
        {...restOfParams}
      />
    </TouchableOpacity>
  );
};

export default ProgressiveViewerImage;
