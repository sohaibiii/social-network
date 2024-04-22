import React, { FC, memo, useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";

import { useTranslation } from "react-i18next";
import { CompletedData } from "react-native-background-upload";
import { Asset } from "react-native-image-picker/src/types";
import Modal from "react-native-modal";
import { ActivityIndicator, useTheme } from "react-native-paper";

import { CText } from "../";
import {
  AnimatedRatingBar,
  Icon,
  IconTypes,
  ImagePicker,
  modalizeRef,
  TextInput
} from "../common";
import { RatingComponentTypes } from "../common/RatingBar/RatingComponent/RatingComponent.types";
import { ExitDialogContent } from "../pagerViewSteps";

import addReviewModalStyles from "./addReviewModal.styles";
import { AddReviewModalProps } from "./addReviewModal.types";

import { backgroundImageUpload } from "~/services/backgroundUploader";
import { generalErrorHandler, logError } from "~/utils/";

const MAX_INPUT_LENGTH = 1000;
const MAX_IMAGES_LENGTH = 15;

const AddReviewModal: FC<AddReviewModalProps> = props => {
  const {
    withStars = true,
    initialRate,
    initialText = "",
    initialGallery = [],
    name,
    inputPlaceholder,
    onSubmit
  } = props;

  const { colors } = useTheme();
  const { t } = useTranslation();

  const [textInputValue, setTextInputValue] = useState(initialText || "");
  const [selectedImages, setSelectedImages] = useState<Asset[]>(initialGallery);
  const [selectedImageIds, setSelectedImageIds] = useState<
    { id: string; name: string }[]
  >(initialGallery?.map(image => ({ id: image.id, name: image.id })));
  const [rating, setRating] = useState(initialRate || 4);
  const [isCloseDialogVisible, setIsCloseDialogVisible] = useState(false);

  const handleImageUpload = (data: CompletedData, fileName: string) => {
    try {
      const uploadedImageId = String(JSON.parse(data.responseBody)[0].id);
      setSelectedImageIds(prev => [...prev, { id: uploadedImageId, name: fileName }]);
    } catch (error) {
      generalErrorHandler(`Error: handleImageUpload --AddReviewModal.tsx-- ${error}`);
    }
  };

  const handleImagesAdded = (images: Asset[]) => {
    images.forEach((item: Asset) => {
      backgroundImageUpload(
        item?.uri || "",
        () => undefined,
        error =>
          logError(
            `Error: backgroundImageUpload --AddReviewModal.tsx uri=${item?.uri} ${error}`
          ),
        data => handleImageUpload(data, item.fileName || ""),
        () => undefined
      );
    });

    setSelectedImages(prev => [...prev, ...images]);
  };

  const handleImageRemove = (image: Asset) => {
    setSelectedImages(prev => prev.filter(item => item.fileName !== image.fileName));
    setSelectedImageIds(prev => prev.filter(item => item.name !== image.fileName));
  };

  const handleOnExitDialogPressed = () => {
    modalizeRef.current?.close();
    hideSheet();
  };

  const onAddRatingPress = () => {
    if ((!rating && withStars) || selectedImages.length > selectedImageIds.length) return;
    onSubmit &&
      onSubmit({
        text: textInputValue,
        images: selectedImages,
        uploadedImageIds: selectedImageIds.map(a => a.id),
        rating
      });
    modalizeRef.current?.close();
  };

  const onClosePress = () => {
    setIsCloseDialogVisible(true);
  };

  const hideSheet = () => {
    setIsCloseDialogVisible(false);
  };

  const remainingTextColor = MAX_INPUT_LENGTH === textInputValue.length ? "red" : "text";
  const remainingText = MAX_INPUT_LENGTH - textInputValue.length;

  const remainingImagesColor =
    MAX_IMAGES_LENGTH === selectedImages.length ? "red" : "text";
  const remainingImages = MAX_IMAGES_LENGTH - selectedImages.length;

  const {
    root,
    ratingStyle,
    textAreaStyle,
    titleContainer,
    buttonStyle,
    imagesContainerStyle,
    titleHeader,
    closeIconStyle,
    remainingTextImagesStyle,
    titleStyle
  } = addReviewModalStyles(colors, selectedImages.length, withStars);

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <Modal
        onBackButtonPress={hideSheet}
        isVisible={isCloseDialogVisible}
        animationIn={"slideInUp"}
        animationOut={"slideOutDown"}
        backdropOpacity={0.5}
        backdropTransitionOutTiming={0}
        // onModalHide={shouldGoBack ? navigation.goBack : undefined}
        onBackdropPress={hideSheet}
        onSwipeComplete={hideSheet}
        onDismiss={hideSheet}
      >
        <ExitDialogContent
          onCancelCb={hideSheet}
          onExitCb={handleOnExitDialogPressed}
          withSaveWork={false}
        />
      </Modal>

      <View style={root}>
        <View style={titleContainer}>
          <Icon
            type={IconTypes.EVIL_ICONS}
            name="close"
            size={30}
            color={colors.gray}
            onPress={onClosePress}
            style={closeIconStyle}
          />
          <View style={titleHeader}>
            <CText
              style={titleStyle}
              fontSize={16}
              color="primary"
              textAlign="center"
              numberOfLines={1}
            >
              {name}
            </CText>
          </View>

          <TouchableOpacity onPress={onAddRatingPress} style={buttonStyle}>
            {selectedImages.length > selectedImageIds.length ? (
              <ActivityIndicator color="white" />
            ) : (
              <CText fontSize={12} color="white">
                {initialText ? t("edit") : t("publish")}
              </CText>
            )}
          </TouchableOpacity>
        </View>
        {withStars ? (
          <AnimatedRatingBar
            ratingCount={5}
            type={RatingComponentTypes.STAR}
            defaultValue={rating}
            size={35}
            containerStyle={ratingStyle}
            onToggleCb={setRating}
          />
        ) : null}

        <TextInput
          multiline
          defaultValue={initialText}
          placeholder={inputPlaceholder}
          maxLength={MAX_INPUT_LENGTH}
          placeholderTextColor={colors.gray}
          style={textAreaStyle}
          value={textInputValue}
          onChangeText={setTextInputValue}
        />
        <CText fontSize={12} color={remainingTextColor} fontFamily="light">
          {t("number_of_characters_remaining")}: {remainingText}
        </CText>
        {withStars && (
          <>
            <CText
              fontSize={12}
              color={remainingImagesColor}
              fontFamily="light"
              style={remainingTextImagesStyle}
            >
              {t("number_of_images_remaining")}: {remainingImages}
            </CText>
            <View style={imagesContainerStyle}>
              <ImagePicker
                initialImages={initialGallery}
                horizontal
                onImagesAddedCb={handleImagesAdded}
                onImageRemovedCb={handleImageRemove}
                maxImagesLength={MAX_IMAGES_LENGTH}
                fullWidth
                mediaType="photo"
              />
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default memo(AddReviewModal);
