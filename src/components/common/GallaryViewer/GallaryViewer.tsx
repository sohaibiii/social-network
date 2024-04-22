import React, { useCallback, useState, useRef, memo, useEffect, useMemo } from "react";
import { View, TouchableOpacity, ScrollView, BackHandler, StatusBar } from "react-native";

import { useTranslation } from "react-i18next";
// import AwesomeGallery, { GalleryRef } from "react-native-awesome-gallery";
import Config from "react-native-config";
import FastImage from "react-native-fast-image";
import ImageViewer from "react-native-image-zoom-viewer";
import Modal from "react-native-modal";
import Orientation, { OrientationType } from "react-native-orientation-locker";
import { useTheme, ActivityIndicator } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import convertToProxyURL from "react-native-video-cache";
import { useSelector, useDispatch } from "react-redux";

import styles, { landscapeStyles } from "./GalleryViewer.styles";

import { RootState } from "~/redux/store";

import { CText, Icon, IconTypes, VideoPlayer } from "~/components/common";
import { LIGHT_STATUS_BAR_ROUTE_NAMES } from "~/constants/";
import { APP_SCREEN_HEIGHT, isRTL, PLATFORM } from "~/constants/variables";
import { hideGalleryViewer } from "~/redux/reducers/galleryViewer.reducer";
import { navigationRef } from "~/services/";
import {
  logEvent,
  GALLERY_SWIPE_LEFT,
  GALLERY_SWIPE_RIGHT,
  HIDE_GALLERY,
  GALLERY_ITEM_DOUBLE_TAPPED,
  GALLERY_LOADED
} from "~/services/analytics";

const analyticsSource = "gallery-viewer";

const GallaryViewer = (): JSX.Element => {
  const currentIndex = useSelector(
    (state: RootState) => state.galleryViewer.currentIndex
  );
  const data = useSelector((state: RootState) => state.galleryViewer.data);
  const disableThumbnailPreview = useSelector(
    (state: RootState) => state.galleryViewer.disableThumbnailPreview
  );
  const isThemeDark = useSelector((state: RootState) => state.settings.isThemeDark);

  const isVisible = useSelector((state: RootState) => state.galleryViewer.isVisible);
  const hideSource = useSelector((state: RootState) => state.galleryViewer.hideSource);

  const sourceType = useSelector((state: RootState) => state.galleryViewer.sourceType);
  const sourceIdentifier = useSelector(
    (state: RootState) => state.galleryViewer.sourceIdentifier
  );
  const isReview = useSelector((state: RootState) => state.galleryViewer.isReview);
  const reviewID = useSelector((state: RootState) => state.galleryViewer.reviewID);

  const images = data;
  const imagesLength = images?.length ?? 0;

  const [orientation, setOrientation] = useState(Orientation.getInitialOrientation());

  useEffect(() => {
    const onOrientationChangeListener = Orientation.addOrientationListener(e => {
      if (
        e === OrientationType.PORTRAIT ||
        e === OrientationType["PORTRAIT-UPSIDEDOWN"] ||
        e === OrientationType["LANDSCAPE-LEFT"] ||
        e === OrientationType["LANDSCAPE-RIGHT"]
      ) {
        setOrientation(e);
      }
    });
    return () => {
      onOrientationChangeListener?.remove();
    };
  }, []);

  const [indexSelected, setIndexSelected] = useState(0);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const thumbnailScrollViewRef = useRef<ScrollView>(null);
  // const carouselRef = useRef<GalleryRef>(null);
  // const firstDoubleTap = useRef(false);
  const selectedIndexRef = useRef(0);

  const theme = useTheme();
  const THUMB_SIZE = 50;
  const HEIGHT = APP_SCREEN_HEIGHT * 0.85;

  useEffect(() => {
    if (isVisible) {
      (() => {
        return logEvent(GALLERY_LOADED, {
          source: sourceType,
          source_id: sourceIdentifier,
          is_review: isReview,
          review_id: reviewID,
          item_index: indexSelected,
          item_uri: data[indexSelected].uri,
          orientation
        });
      })();

      Orientation.unlockAllOrientations();
    } else {
      Orientation.lockToPortrait();
    }
  }, [isVisible]);

  const {
    modalStyle,
    imageGalleryStyle,
    imageWrapperStyle,
    containerStyle,
    imageIndicatorWrapperStyle,
    imageThumbnailWrapperStyle,
    imageViewerWrapperStyle,
    thumbnailSelectedStyle,
    thumbnailStyle,
    closeWrapperStyle,
    galleryWrapperStyle,
    ownerAndSourceStyle,
    fullWidth,
    flex,
    videoStyle
  } =
    orientation === OrientationType.PORTRAIT
      ? useMemo(
          () => styles(theme, HEIGHT, THUMB_SIZE, insets),
          [theme, HEIGHT, THUMB_SIZE, insets]
        )
      : useMemo(
          () => landscapeStyles(theme, HEIGHT, THUMB_SIZE, insets),
          [theme, HEIGHT, THUMB_SIZE, insets]
        );

  useEffect(() => {
    // selectedIndexRef.current = currentIndex;
    setIndexSelected(currentIndex);

    setShouldPlay(
      galleryFormatted[currentIndex]?.url?.startsWith(Config.VIDEOS_MEDIA_PREFIX)
        ? galleryFormatted[currentIndex].url
        : ""
    );
    setIsVideo(
      galleryFormatted[currentIndex]?.url?.startsWith(Config.VIDEOS_MEDIA_PREFIX)
        ? true
        : false
    );
  }, [currentIndex, data, galleryFormatted]);

  // const thumbnailFormatted = useMemo(
  //   () =>
  //     images?.map(image => {
  //       return typeof image === "number"
  //         ? image
  //         : { uri: image.type === "video" ? image.thumbnail : (image.uri as string) };
  //     }) || [],
  //   [images]
  // );

  //the replacement of 0000001 to 0000000 to make sure that short video get loaded without changing the thumbnail
  const galleryFormatted = useMemo(
    () =>
      images?.map(item => {
        return {
          id: item.uri,
          uri: item.uri,
          url:
            item.type === "video"
              ? item.thumbnail?.replace("0000001", "0000000") ?? ""
              : typeof item === "number"
              ? item
              : item.uri,
          source: typeof item === "number" ? item : { uri: item.uri as string },
          width: item.width,
          height: item.height,
          type: item.type,
          thumbnail: item.thumbnail ?? "",
          format: item.format ?? "",
          imageOwner: item.owner ?? "",
          imageSource: item.source ?? ""
        };
      }) || [],
    [images]
  );

  const galleryFormattedUrl = useMemo(
    () =>
      images?.map(item => {
        return {
          url:
            item.type === "video"
              ? item.thumbnail?.replace("0000001", "0000000") ?? ""
              : typeof item === "number"
              ? item
              : item.uri
        };
      }) || [],
    [images]
  );

  const onSelect = useCallback(
    (indexSelected: number) => {
      selectedIndexRef.current = indexSelected;

      const index =
        isRTL && PLATFORM === "android"
          ? imagesLength - 1 - indexSelected
          : indexSelected;

      setIndexSelected(index);

      thumbnailScrollViewRef?.current?.scrollTo({
        x: index * THUMB_SIZE,
        y: 0,
        animated: true
      });
    },
    [imagesLength]
  );

  // const onTouchThumbnail = useCallback((touchedIndex: number) => {
  //   carouselRef?.current?.setIndex(touchedIndex);
  // }, []);

  const [shouldPlay, setShouldPlay] = useState("");
  const [isVideo, setIsVideo] = useState(false);
  const [willDismiss, setWillDismiss] = useState(true);
  const ref = useRef();
  const renderGalleryItem = useCallback(
    props => {
      if (props.source.uri.startsWith(Config.VIDEOS_MEDIA_PREFIX)) {
        const videoUUID = props.source?.uri
          ?.replace(Config.VIDEOS_MEDIA_PREFIX, "")
          ?.split("/")[1];
        const isPaused = props.source.uri !== shouldPlay;

        return (
          <View style={videoStyle}>
            <VideoPlayer
              ref={!isPaused ? ref : null}
              onFullscreenPlayerWillPresent={() => {
                Orientation.unlockAllOrientations();
                setWillDismiss(false);
              }}
              onFullscreenPlayerWillDismiss={() => {
                setWillDismiss(true);
              }}
              onFullscreenPlayerDidDismiss={willDismiss && handleCloseImageViewer}
              source={{
                uri: convertToProxyURL(
                  `${Config.VIDEOS_MEDIA_PREFIX}/${videoUUID}/${videoUUID}.mp4`
                )
              }}
              isFromGallery
              poster={props.source.uri}
              paused={isPaused}
              controls={!isPaused}
              muted={false}
            />
          </View>
        );
      }
      return (
        <View style={videoStyle}>
          <FastImage
            fallback
            style={props.style}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
          />
        </View>
      );
    },
    [shouldPlay, videoStyle, willDismiss]
  );

  const onChange = async index => {
    const swipeDirectionEvent =
      index > indexSelected ? GALLERY_SWIPE_RIGHT : GALLERY_SWIPE_LEFT;

    await logEvent(swipeDirectionEvent, {
      source: sourceType,
      source_id: sourceIdentifier,
      is_review: isReview,
      review_id: reviewID,
      item_index: index,
      item_uri: data[index].uri,
      orientation
    });

    setIndexSelected(index);
    if (
      index !== undefined &&
      galleryFormatted[index].url.startsWith(Config.VIDEOS_MEDIA_PREFIX)
    ) {
      setIsVideo(true);
      setShouldPlay(galleryFormatted[index].url);
    } else {
      setIsVideo(false);
      setShouldPlay("");
    }
  };

  const handleCloseImageViewer = useCallback(async () => {
    await logEvent(HIDE_GALLERY, {
      source: sourceType,
      source_id: sourceIdentifier,
      is_review: isReview,
      review_id: reviewID,
      orientation
    });
    ref?.current?.destroyVideoPlayerComponent();
    Orientation.lockToPortrait();
    dispatch(hideGalleryViewer({}));
  }, [dispatch, sourceType, sourceIdentifier, reviewID]);

  const handleDoubleClickCb = () => {
    return logEvent(GALLERY_ITEM_DOUBLE_TAPPED, {
      source: sourceType,
      source_id: sourceIdentifier,
      item_index: indexSelected,
      item_uri: data[indexSelected]?.uri,
      orientation
    });
  };

  // const handleKeyExtractor = useCallback((item, index) => {
  //   return item?.source?.uri ?? index;
  // }, []);

  const handleGalleryIndexChanged = useCallback(
    (newIndex: number) => {
      onSelect(newIndex);
    },
    [onSelect]
  );

  // const handleResetOnSecondDoubleTap = useCallback(() => {
  //   firstDoubleTap.current = !firstDoubleTap?.current;
  //   if (!firstDoubleTap.current) {
  //     carouselRef?.current?.reset();
  //   }
  // }, []);

  // const GALLERY_CONTAINER_DIMENSIONS = {
  //   width: APP_SCREEN_WIDTH,
  //   height: APP_SCREEN_HEIGHT * 0.8
  // };

  // const GALLERY_CONTAINER_DIMENSIONS_LANDSCAPE = {
  //   width: APP_SCREEN_HEIGHT * 0.8,
  //   height: APP_SCREEN_WIDTH
  // };

  useEffect(() => {
    const handler = () => {
      if (!isVisible) {
        return false;
      }
      handleCloseImageViewer();
      return true;
    };
    BackHandler.addEventListener("hardwareBackPress", handler);

    return () => BackHandler.removeEventListener("hardwareBackPress", handler);
  }, [handleCloseImageViewer, isVisible]);

  useEffect(() => {
    const currentRouteName = navigationRef?.current?.getCurrentRoute()?.name;

    if (isVisible) {
      StatusBar?.setBarStyle("light-content");
    } else {
      if (LIGHT_STATUS_BAR_ROUTE_NAMES.includes(currentRouteName)) {
        StatusBar.setBarStyle("light-content", true);
      } else {
        StatusBar.setBarStyle(isThemeDark ? "light-content" : "dark-content", true);
      }
    }
  }, [isVisible, isThemeDark]);

  const textAlign = isRTL ? "right" : "left";

  const { imageOwner = "", imageSource = "" } = galleryFormatted[indexSelected] || {};
  const hasOwner = !!imageOwner && imageOwner !== "0";
  const hasSource = !!imageSource && imageSource !== "None";

  const renderHeaderComponent = useCallback(() => {
    return (
      <View style={containerStyle}>
        <View style={imageIndicatorWrapperStyle}>
          <CText color="white" textAlign={"left"}>
            {isRTL
              ? `${imagesLength}/${indexSelected + 1}`
              : `${indexSelected + 1}/${imagesLength}`}
          </CText>
        </View>
        {(PLATFORM !== "ios" || !isVideo) && (
          <TouchableOpacity style={closeWrapperStyle} onPress={handleCloseImageViewer}>
            <Icon
              type={IconTypes.MATERIAL_COMMUNITY_ICONS}
              name={"close"}
              size={25}
              color="white"
              disabled
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }, [
    closeWrapperStyle,
    handleCloseImageViewer,
    imageIndicatorWrapperStyle,
    imagesLength,
    indexSelected,
    containerStyle,
    isVideo
  ]);

  const renderIndicator = () => <View />;
  const loadingRender = () => <ActivityIndicator color={theme.colors.white} />;

  const renderFooter = () => {
    return (
      <>
        {!hideSource && (hasOwner || hasSource) && (
          <View style={ownerAndSourceStyle}>
            {hasOwner && (
              <CText
                textAlign={textAlign}
                style={fullWidth}
                color={"white"}
                fontSize={13}
              >
                {`${t("owner")}: ${imageOwner}`}
              </CText>
            )}
            {hasSource && (
              <CText
                textAlign={textAlign}
                style={fullWidth}
                color={"white"}
                fontSize={13}
              >{`${t("source")}: ${imageSource}`}</CText>
            )}
          </View>
        )}
      </>
    );
  };

  if (!isVisible) {
    return null;
  }
  return (
    <Modal
      onBackButtonPress={null}
      isVisible={isVisible}
      style={modalStyle}
      propagateSwipe={true}
      swipeDirection={["up", "down"]}
      coverScreen={PLATFORM === "ios"}
    >
      <ScrollView contentContainerStyle={flex} scrollEnabled={false}>
        <ImageViewer
          imageUrls={galleryFormattedUrl}
          onChange={onChange}
          enableImageZoom={!isVideo}
          index={currentIndex}
          useNativeDriver
          pageAnimateTime={100}
          enableSwipeDown
          onSwipeDown={handleCloseImageViewer}
          renderIndicator={renderIndicator}
          enablePreload
          saveToLocalByLongPress={false}
          renderImage={renderGalleryItem}
          loadingRender={loadingRender}
          renderHeader={renderHeaderComponent}
          renderFooter={renderFooter}
          onDoubleClick={handleDoubleClickCb}
        />
      </ScrollView>
    </Modal>
  );
  // return (
  //   <Modal
  //     onBackButtonPress={null}
  //     isVisible={isVisible}
  //     style={modalStyle}
  //     propagateSwipe={true}
  //     swipeDirection={["up", "down"]}
  //     coverScreen={PLATFORM === "ios"}
  //   >
  //     <SafeAreaView style={containerStyle}>
  //       <View style={imageViewerWrapperStyle}>
  //         <View>
  //           <View style={imageIndicatorWrapperStyle}>
  //             <CText color="white" textAlign={"left"}>
  //               {isRTL
  //                 ? `${imagesLength}/${
  //                     isRTL && PLATFORM === "android"
  //                       ? imagesLength - indexSelected
  //                       : indexSelected + 1
  //                   }`
  //                 : `${indexSelected + 1}/${imagesLength}`}
  //             </CText>
  //           </View>
  //           <TouchableOpacity style={closeWrapperStyle} onPress={handleCloseImageViewer}>
  //             <Icon
  //               type={IconTypes.MATERIAL_COMMUNITY_ICONS}
  //               name={"close"}
  //               size={25}
  //               color="white"
  //               disabled
  //             />
  //           </TouchableOpacity>
  //           <View style={galleryWrapperStyle} onStartShouldSetResponder={() => true}>
  //             <AwesomeGallery
  //               data={galleryFormatted}
  //               ref={carouselRef}
  //               keyExtractor={handleKeyExtractor}
  //               onIndexChange={handleGalleryIndexChanged}
  //               renderItem={renderGalleryItem}
  //               onSwipeToClose={handleCloseImageViewer}
  //               initialIndex={currentIndex}
  //               onDoubleTap={handleResetOnSecondDoubleTap}
  //               disableTransitionOnScaledImage
  //               numToRender={3}
  //             />
  //           </View>
  //         </View>
  //         {!hideSource && (hasOwner || hasSource) && (
  //           <View style={ownerAndSourceStyle}>
  //             {hasOwner && (
  //               <CText
  //                 textAlign={textAlign}
  //                 style={fullWidth}
  //                 color={"white"}
  //                 fontSize={13}
  //               >
  //                 {`${t("owner")}: ${imageOwner}`}
  //               </CText>
  //             )}
  //             {hasSource && (
  //               <CText
  //                 textAlign={textAlign}
  //                 style={fullWidth}
  //                 color={"white"}
  //                 fontSize={13}
  //               >{`${t("source")}: ${imageSource}`}</CText>
  //             )}
  //           </View>
  //         )}
  //         <View style={imageThumbnailWrapperStyle}>
  //           {!disableThumbnailPreview && (
  //             <ScrollView
  //               horizontal
  //               showsHorizontalScrollIndicator={false}
  //               ref={thumbnailScrollViewRef}
  //             >
  //               {thumbnailFormatted?.map((item, index) => {
  //                 const currentIndex =
  //                   isRTL && PLATFORM === "android" ? imagesLength - 1 - index : index;

  //                 return (
  //                   <TouchableOpacity
  //                     key={`${item.uri}-${index}`}
  //                     onPress={() => onTouchThumbnail(index)}
  //                     activeOpacity={0.9}
  //                   >
  //                     <FastImage
  //                       style={
  //                         currentIndex === indexSelected
  //                           ? thumbnailSelectedStyle
  //                           : thumbnailStyle
  //                       }
  //                       source={item}
  //                       resizeMode={FastImage.resizeMode.cover}
  //                     />
  //                   </TouchableOpacity>
  //                 );
  //               })}
  //             </ScrollView>
  //           )}
  //         </View>
  //       </View>
  //     </SafeAreaView>
  //   </Modal>
  // );
};

export default memo(GallaryViewer);
