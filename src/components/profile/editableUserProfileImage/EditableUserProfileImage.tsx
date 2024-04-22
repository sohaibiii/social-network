import React, { useState } from "react";
import { View } from "react-native";

import { useTranslation } from "react-i18next";
import FastImage from "react-native-fast-image";
import {
  CameraOptions,
  launchCamera,
  launchImageLibrary
} from "react-native-image-picker";
import { ImagePickerResponse } from "react-native-image-picker/src/types";
import { Avatar, TouchableRipple, useTheme } from "react-native-paper";

import editableUserProfileImageStyle from "./EditableUserProfileImage.style";
import { UserProfileImageType } from "./EditableUserProfileImage.types";

import IMAGES from "~/assets/images";
import { ActionSheet, CText, Icon, IconTypes } from "~/components/common";
import { PLATFORM } from "~/constants/";
import { requestCameraPermission, requestGalleryPermissions } from "~/services/";
import { translate } from "~/translations/";
import { moderateScale, scale, verticalScale } from "~/utils/";

const EditableUserProfileImage = (props: UserProfileImageType): JSX.Element => {
  const {
    source,
    style = {},
    width = verticalScale(100),
    height = verticalScale(100),
    borderRadius = 50,
    firstNameCharacters = "",
    onImagePicked = () => undefined,
    onImageDeleted = () => undefined,
    ...restOfParams
  } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const {
    image,
    editIconStyle,
    removeIconStyle,
    deletePhotoContainer,
    avatarStyle,
    avatarLabelStyle
  } = editableUserProfileImageStyle(colors);
  const [newSource, setNewSource] = useState(source);
  const imageStyle = [image, style, { width, height }];

  const handleCameraPressed = async () => {
    const hasAccess = await requestCameraPermission();
    if (hasAccess) {
      const launchCameraOptions: CameraOptions =
        PLATFORM === "ios"
          ? { presentationStyle: "fullScreen", mediaType: "photo", quality: 0.9 }
          : { presentationStyle: "fullScreen", mediaType: "photo" };
      launchCamera(launchCameraOptions, handleAssetsPicked);
    }
  };

  const handleLibraryPressed = async () => {
    const hasAccess = await requestGalleryPermissions();
    if (hasAccess) {
      launchImageLibrary(
        {
          selectionLimit: 1,
          mediaType: "photo"
        },
        handleAssetsPicked
      );
    }
  };

  const handleAssetsPicked = async (response: ImagePickerResponse) => {
    if (!response?.assets || response?.assets.length < 0) return;
    setNewSource(response?.assets[0]);
    onImagePicked(response?.assets[0]);
  };

  const options = [
    {
      title: translate("camera"),
      callback: handleCameraPressed,
      icon: "camera"
    },
    {
      title: translate("photo_library"),
      callback: handleLibraryPressed,
      icon: "image"
    }
  ];

  const handleDeleteImage = () => {
    setNewSource(null);
    onImageDeleted();
  };

  return (
    <View>
      <View>
        {newSource ? (
          <FastImage
            borderRadius={borderRadius}
            style={imageStyle}
            thumbnailSource={IMAGES.user_profile_default}
            errorSource={IMAGES.user_profile_default}
            source={newSource}
            onError={() => setNewSource(null)}
            {...restOfParams}
          />
        ) : (
          <Avatar.Text
            style={avatarStyle}
            labelStyle={avatarLabelStyle}
            size={moderateScale(100)}
            label={firstNameCharacters}
          />
        )}
        <ActionSheet
          icon={"pencil-outline"}
          iconColor={colors.gray}
          options={options}
          mediaType={"mixed"}
          style={editIconStyle}
          actionTitle={t("change_profile_picture")}
        />
      </View>
      <TouchableRipple
        onPress={handleDeleteImage}
        rippleColor={"white"}
        style={removeIconStyle}
      >
        <View style={deletePhotoContainer}>
          <CText fontSize={12} lineHeight={16} color={"gray"}>
            {t("delete_photo")}
          </CText>
          <Icon
            disabled
            color={colors.gray}
            type={IconTypes.MATERIAL_COMMUNITY_ICONS}
            size={scale(17)}
            name={"delete-outline"}
          />
        </View>
      </TouchableRipple>
    </View>
  );
};
export default EditableUserProfileImage;
