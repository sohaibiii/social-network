import React, { useState, useMemo, useCallback } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

import { useTranslation } from "react-i18next";
import { Image } from "react-native-compressor";
import { createThumbnail } from "react-native-create-thumbnail";
import {
  Asset,
  launchCamera,
  launchImageLibrary,
  CameraOptions
} from "react-native-image-picker";
import { ImagePickerResponse } from "react-native-image-picker/src/types";
import { Text, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch } from "react-redux";

import imagePickerStyle from "./ImagePicker.style";

import { ImagePreviewItem } from "~/components/";
import { ActionSheet } from "~/components/common";
import { ImagePickerProps } from "~/components/common/ImagePicker/ImagePicker.types";
import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import { APP_SCREEN_WIDTH, PLATFORM } from "~/constants/";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import {
  openAppSettings,
  requestCameraPermission,
  requestGalleryPermissions
} from "~/services/";
import { translate } from "~/translations/";
import { scale } from "~/utils/";

const ImagePicker = (props: ImagePickerProps): JSX.Element => {
  const { colors } = useTheme();
  const { initialImages = [], maxImagesLength = 10, title = "" } = props;
  const [images, setImages] = useState<Asset[]>(initialImages);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const imageSize = APP_SCREEN_WIDTH / 3 - scale(24);

  const {
    libraryOptions = {
      mediaType: props.mediaType || "mixed",
      includeBase64: false,
      selectionLimit: maxImagesLength - images.length
    },
    cameraOptions = {
      mediaType: props.mediaType || "mixed",
      includeBase64: false,
      selectionLimit: maxImagesLength - images.length
    },
    horizontal,
    fullWidth,
    mediaType = "mixed",
    onImageRemovedCb = (_image: Asset) => undefined,
    onImagesAddedCb = (_image: Asset[]) => undefined
  } = props;

  const {
    row,
    actionSheetContainer,
    imagesContainer,
    optionText,
    containerStyle,
    directionStyle
  } = useMemo(() => imagePickerStyle(colors, fullWidth), [colors, fullWidth]);

  const handleCameraPressed = async (isVideo = false) => {
    const hasAccess = await requestCameraPermission();
    if (hasAccess) {
      const launchCameraOptions: CameraOptions = isVideo
        ? {
            presentationStyle: "fullScreen",
            mediaType: isVideo ? "video" : "photo"
          }
        : PLATFORM === "ios"
        ? {
            presentationStyle: "fullScreen",
            mediaType: isVideo ? "video" : "photo",
            includeBase64: false,
            quality: 0.5,
            saveToPhotos: false,
            includeExtra: false
          }
        : {
            presentationStyle: "fullScreen",
            mediaType: isVideo ? "video" : "photo"
          };
      launchCamera(launchCameraOptions, handleAssetsPicked);
    }
  };

  const handleLibraryPressed = async () => {
    const hasAccess = await requestGalleryPermissions();
    if (hasAccess) {
      launchImageLibrary(libraryOptions, handleAssetsPicked);
    }
  };

  const options = [
    {
      title: translate("photo"),
      callback: handleCameraPressed,
      icon: "camera",
      id: "photo"
    },
    {
      title: translate("video"),
      callback: () => handleCameraPressed(true),
      icon: "image",
      id: "video"
    }
  ];

  const handleAssetsPicked = async (response: ImagePickerResponse) => {
    if (!response?.assets) return;

    const assets = await Promise.all(
      [...response?.assets].map(async asset => {
        if (!!asset.uri && asset.type?.includes("video")) {
          const videoThumbnailObj = await createThumbnail({
            url: asset.uri,
            cacheName: asset.fileName
          });
          return {
            ...asset,
            ...videoThumbnailObj,
            thumbnail: videoThumbnailObj?.path
          };
        } else if (!!asset.uri && asset.type?.includes("image")) {
          return {
            ...asset,
            thumbnail: await Image.compress(asset.uri, {
              compressionMethod: "auto"
            })
          };
        }
        return asset;
      })
    );

    let slicedImages = assets || [];
    if (maxImagesLength > 0) {
      slicedImages = slicedImages.slice(0, maxImagesLength - images.length);
      if (assets.length + images.length > maxImagesLength) {
        dispatch(
          showSnackbar({
            text: t("error_images_max_reached", { count: maxImagesLength }),
            type: SnackbarVariations.SNACKBAR,
            duration: 2000,
            backgroundColor: colors.red
          })
        );
      }
    }
    onImagesAddedCb(slicedImages);
    setImages(oldValue => [...oldValue, ...slicedImages]);
  };

  const handleImageRemoved = useCallback(
    (image: Asset) => {
      const index = images.findIndex(item => {
        return image.alreadyUploaded
          ? item?.uuid === image?.uuid
          : item?.fileName === image.fileName;
      });

      if (index > -1) {
        onImageRemovedCb(image);
        const tempImages = Array.from(images);
        tempImages.splice(index, 1);
        setImages(tempImages);
      }
    },
    [images, onImageRemovedCb]
  );

  const ImageContainer = horizontal ? ScrollView : View;
  const imageContainerProps = horizontal ? { horizontal: true } : {};

  return (
    <View style={containerStyle}>
      <View style={actionSheetContainer}>
        <View>
          {maxImagesLength !== images.length ? (
            <View style={directionStyle}>
              <ActionSheet
                icon={"camera-outline"}
                iconColor={colors.grayReversed}
                options={options}
                mediaType={mediaType}
                text={translate("camera")}
                textStyle={optionText}
                buttonStyle={row}
                actionTitle={title}
              />
              <TouchableOpacity style={row} onPress={handleLibraryPressed}>
                <Icon
                  color={colors.grayReversed}
                  name={"image-outline"}
                  size={scale(20)}
                />
                <Text style={optionText}>{translate("photo_library")}</Text>
              </TouchableOpacity>
            </View>
          ) : null}
          <ImageContainer
            keyboardShouldPersistTaps={"handled"}
            {...imageContainerProps}
            style={imagesContainer}
          >
            {images.map(image => (
              <ImagePreviewItem
                key={image.alreadyUploaded ? image?.uuid : image?.fileName}
                image={image}
                size={imageSize}
                onPress={handleImageRemoved}
              />
            ))}
          </ImageContainer>
        </View>
      </View>
    </View>
  );
};
export default ImagePicker;
