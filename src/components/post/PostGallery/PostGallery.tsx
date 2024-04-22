import React, { useEffect, useState, memo, useMemo, useCallback } from "react";
import { View, TouchableOpacity } from "react-native";

import isEqual from "react-fast-compare";
import { useTranslation } from "react-i18next";
import Config from "react-native-config";
import FastImage from "react-native-fast-image";
import { ActivityIndicator, useTheme } from "react-native-paper";
import { LoadError } from "react-native-video";
import { useDispatch } from "react-redux";

import styles from "./PostGallery.styles";
import { PostGalleryType, GalleryLayoutType } from "./PostGallery.types";

import { CText, Icon, IconTypes } from "~/components/common";
import { VideoPreview } from "~/components/post";
import { DEFAULTS } from "~/constants/";
import { showGalleryViewer } from "~/redux/reducers/galleryViewer.reducer";
import { logEvent, SPONSERSHIP_CLICKED } from "~/services/";
import { openURL } from "~/services/inappbrowser";
import { getImageSize, logError, scale } from "~/utils/";

const ANALYTICS_SOURCE = "post_gallery";

const PostGallery = (props: PostGalleryType): JSX.Element => {
  const { gallery, pkey, timestamp, isSponsorship = false, link = "" } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();

  const [galleryMode, setGalleryMode] = useState<GalleryLayoutType>(
    GalleryLayoutType.VERTICAL
  );

  const galleryFormatted = useMemo(
    () =>
      gallery
        ?.map(item => {
          const { id = "", format = "", thumbnail = "" } = item;
          const isVideo = item.type === "video";

          return {
            uri: isVideo
              ? `${Config.VIDEOS_MEDIA_PREFIX}/${id}/${id}${format}`
              : `${Config.SOCIAL_MEDIA_PREFIX}/${id}_md.jpg`,
            source: {
              uri: isVideo
                ? thumbnail
                  ? `${Config.VIDEOS_MEDIA_PREFIX}/${id}/${id}.${thumbnail}`
                  : ""
                : `${Config.SOCIAL_MEDIA_PREFIX}/${id}_md.jpg`
            },
            width: isVideo ? item.widthInPx : item.width,
            height: isVideo ? item.heightInPx : item.height,
            type: item.type,
            thumbnail: thumbnail
              ? `${Config.VIDEOS_MEDIA_PREFIX}/${id}/${id}.${thumbnail}`
              : "",
            format,
            isLoadingVideo: isVideo && (!format || !thumbnail)
          };
        })
        ?.sort((a, b) => {
          const aArea = a.width > a.height ? a.width / a.height : a.height / a.width,
            bArea = b.height > b.width ? b.height / b.width : b.width / b.height;
          // compare the area of each
          return bArea - aArea;
        }) || [],
    [gallery]
  );
  const totalImages = useMemo(() => gallery?.length ?? 0, [gallery?.length]);
  const {
    fullGridWrapperStyle,
    flexGrowWithMarginStyle,
    flexGrowWithoutMarginStyle,
    columnFlexMarginLeftStyle,
    gridWrapperStyle,
    gridWrapperColumnStyle,
    rowFlexMarginTopStyle,
    rowFlex,
    marginBottom,
    marginTop,
    flexGrow,
    marginLeft,
    bigFlexMarginBottom,
    marginRight,
    marginHorizontal,
    bigFlexMarginBottomRow,
    marginVertical,
    fastImageRelativeStyle,
    loadingVideoStyle,
    uploadingVideoTextStyle,
    moreGalleryWrapperStyles,
    moreGalleryInnerWrapperStyles,
    videoIconWrapperStyle
  } = useMemo(() => styles, []);

  useEffect(() => {
    const initialCalculation = async () => {
      try {
        if (galleryFormatted.length === 0) {
          return;
        }
        const uriToGetSize =
          galleryFormatted[0].type === "video"
            ? galleryFormatted[0].thumbnail
            : galleryFormatted[0].uri;

        /*
          let width = 0;
          let height = 0;
          if ("width" in galleryFormatted[0] && "height" in galleryFormatted[0]) {
            height = galleryFormatted[0]?.height || 0;
            width = galleryFormatted[0]?.width || 0;
          } else {
            const dimensions = await getImageSize(uriToGetSize);
            height = dimensions?.height;
            width = dimensions?.width;
          }
         */

        const { width = 0, height = 0 } = galleryFormatted[0].isLoadingVideo
          ? galleryFormatted[0]
          : await getImageSize(uriToGetSize);

        setGalleryMode(
          width / height >= DEFAULTS.GALLERY_LANDSCAPE_RATIO
            ? GalleryLayoutType.LANDSCAPE
            : height / width >= DEFAULTS.GALLERY_LANDSCAPE_RATIO
            ? GalleryLayoutType.PORTRAIT
            : height / width >= width / height
            ? GalleryLayoutType.VERTICAL
            : GalleryLayoutType.HORIZONTAL
        );
      } catch (error) {
        logError(
          `Error: initialCalculation --PostGallery.tsx-- uri=${galleryFormatted[0].uri} type=${galleryFormatted[0].type} ${error}`
        );
      }
    };
    initialCalculation();
  }, [galleryFormatted]);

  const setGalleryIndex = useCallback(
    (index: number) => {
      dispatch(
        showGalleryViewer({
          data: galleryFormatted,
          isVisible: true,
          disableThumbnailPreview: false,
          currentIndex: index || 0,
          hideSource: true,
          sourceType: ANALYTICS_SOURCE,
          sourceIdentifier: pkey
        })
      );
    },
    [dispatch, galleryFormatted, pkey]
  );

  const onImageError = useCallback(
    (uri: string) => {
      logError(
        `Error: loading FastImage uri=${uri} --PostGallery.tsx-- timestamp=${timestamp} pkey=${pkey}`
      );
    },
    [pkey, timestamp]
  );

  const renderGalleryItem = useCallback(
    (galleryIndex: number) => {
      const { type, uri, source, thumbnail, isLoadingVideo } =
        galleryFormatted[galleryIndex] || {};

      return (
        <>
          {type === "video" ? (
            <View style={flexGrowWithoutMarginStyle}>
              {galleryIndex === 0 ? (
                isLoadingVideo ? (
                  <View style={loadingVideoStyle}>
                    <ActivityIndicator size={"large"} color={theme.colors.white} />
                    <CText color={"white"} fontSize={13} style={uploadingVideoTextStyle}>
                      {t("uploading_video")}
                    </CText>
                  </View>
                ) : (
                  <VideoPreview
                    uri={uri}
                    thumbnail={thumbnail}
                    resizeMode={"cover"}
                    posterResizeMode={"cover"}
                  />
                )
              ) : (
                <>
                  <FastImage
                    style={fastImageRelativeStyle}
                    source={source}
                    onError={() => onImageError(source.uri)}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                  <View style={moreGalleryWrapperStyles}>
                    <View style={videoIconWrapperStyle}>
                      <Icon
                        type={IconTypes.ION_ICONS}
                        name="md-play"
                        color={theme.colors.white}
                        size={scale(35)}
                      />
                    </View>
                  </View>
                </>
              )}
            </View>
          ) : (
            <FastImage
              style={fastImageRelativeStyle}
              source={source}
              onError={() => onImageError(source.uri)}
              resizeMode={FastImage.resizeMode.cover}
            />
          )}
        </>
      );
    },
    [
      fastImageRelativeStyle,
      flexGrowWithMarginStyle,
      galleryFormatted,
      videoIconWrapperStyle,
      moreGalleryWrapperStyles,
      theme.colors.white
    ]
  );

  const openSponsershipLink = useCallback(async () => {
    const newURL = link.indexOf("://") === -1 ? "https://" + link : link;
    openURL(newURL);
    await logEvent(SPONSERSHIP_CLICKED, { source: "post_sponsership", link: newURL });
  }, [link]);

  const renderFullGrid = useCallback(() => {
    return (
      <TouchableOpacity
        style={fullGridWrapperStyle}
        onPress={() => (isSponsorship ? openSponsershipLink() : setGalleryIndex(0))}
      >
        {renderGalleryItem(0)}
      </TouchableOpacity>
    );
  }, [
    fullGridWrapperStyle,
    renderGalleryItem,
    isSponsorship,
    openSponsershipLink,
    setGalleryIndex
  ]);

  const renderTwoItemsGrid = useCallback(() => {
    return (
      <View style={gridWrapperStyle}>
        <TouchableOpacity onPress={() => setGalleryIndex(0)} style={marginRight}>
          {renderGalleryItem(0)}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setGalleryIndex(1)} style={marginLeft}>
          {renderGalleryItem(1)}
        </TouchableOpacity>
      </View>
    );
  }, [gridWrapperStyle, marginRight, renderGalleryItem, marginLeft, setGalleryIndex]);

  const renderThreeItemsGridVertical = useCallback(() => {
    return (
      <View style={gridWrapperStyle}>
        <TouchableOpacity onPress={() => setGalleryIndex(0)} style={flexGrow}>
          {renderGalleryItem(0)}
        </TouchableOpacity>
        <View style={columnFlexMarginLeftStyle}>
          <TouchableOpacity onPress={() => setGalleryIndex(1)} style={marginBottom}>
            {renderGalleryItem(1)}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setGalleryIndex(2)} style={marginTop}>
            {renderGalleryItem(2)}
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [
    gridWrapperStyle,
    flexGrow,
    renderGalleryItem,
    columnFlexMarginLeftStyle,
    marginBottom,
    marginTop,
    setGalleryIndex
  ]);

  const renderThreeItemsGridHorizontal = useCallback(() => {
    return (
      <View style={gridWrapperColumnStyle}>
        <TouchableOpacity onPress={() => setGalleryIndex(0)} style={flexGrow}>
          {renderGalleryItem(0)}
        </TouchableOpacity>
        <View style={rowFlexMarginTopStyle}>
          <TouchableOpacity onPress={() => setGalleryIndex(1)} style={marginRight}>
            {renderGalleryItem(1)}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setGalleryIndex(2)} style={marginLeft}>
            {renderGalleryItem(2)}
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [
    gridWrapperColumnStyle,
    flexGrow,
    renderGalleryItem,
    rowFlexMarginTopStyle,
    marginRight,
    marginLeft,
    setGalleryIndex
  ]);

  /*
  const renderFourItemsGrid = useCallback(() => {
    return (
      <View style={gridWrapperColumnStyle}>
        <View style={rowFlexMarginStyle}>
          <TouchableOpacity
            onPress={() => setGalleryIndex(0)}
            style={flexGrowWithMarginStyle}
          >
            <FastImage
              style={fastImageStyle}
              source={{
                uri: galleryFormatted[0]?.uri
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setGalleryIndex(1)}
            style={flexGrowWithMarginStyle}
          >
            <FastImage
              style={fastImageStyle}
              source={{
                uri: galleryFormatted[1]?.uri
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
        </View>
        <View style={rowFlexMarginStyle}>
          <TouchableOpacity
            onPress={() => setGalleryIndex(2)}
            style={flexGrowWithMarginStyle}
          >
            <FastImage
              style={fastImageStyle}
              source={{
                uri: galleryFormatted[2]?.uri
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setGalleryIndex(3)}
            style={flexGrowWithMarginStyle}
          >
            <FastImage
              style={fastImageStyle}
              source={{
                uri: galleryFormatted[3]?.uri
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [
    fastImageStyle,
    flexGrowWithMarginStyle,
    galleryFormatted,
    gridWrapperColumnStyle,
    rowFlexMarginStyle,
    setGalleryIndex
  ]);
*/

  const renderFourPlusItemsGridLandscape = useCallback(() => {
    return (
      <View style={gridWrapperColumnStyle}>
        <TouchableOpacity onPress={() => setGalleryIndex(0)} style={bigFlexMarginBottom}>
          {renderGalleryItem(0)}
        </TouchableOpacity>
        <View style={rowFlexMarginTopStyle}>
          <TouchableOpacity onPress={() => setGalleryIndex(1)} style={flexGrow}>
            {renderGalleryItem(1)}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setGalleryIndex(2)} style={marginHorizontal}>
            {renderGalleryItem(2)}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setGalleryIndex(3)} style={flexGrow}>
            {renderGalleryItem(3)}

            {galleryFormatted.length - 4 > 0 && (
              <View style={moreGalleryWrapperStyles}>
                <View style={moreGalleryInnerWrapperStyles}>
                  <CText color={"white"} fontSize={18} textAlign="center">{`${
                    galleryFormatted.length - 4
                  }+`}</CText>
                  <CText color={"white"} fontSize={14} textAlign="center">
                    {t("other_gallery.humanized", { count: galleryFormatted.length - 4 })}
                  </CText>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [
    gridWrapperColumnStyle,
    bigFlexMarginBottom,
    renderGalleryItem,
    rowFlexMarginTopStyle,
    flexGrow,
    marginHorizontal,
    galleryFormatted.length,
    moreGalleryWrapperStyles,
    moreGalleryInnerWrapperStyles,
    t,
    setGalleryIndex
  ]);

  const renderFourPlusItemsGridPortrait = useCallback(() => {
    return (
      <View style={gridWrapperStyle}>
        <TouchableOpacity onPress={() => setGalleryIndex(0)} style={bigFlexMarginBottom}>
          {renderGalleryItem(0)}
        </TouchableOpacity>
        <View style={columnFlexMarginLeftStyle}>
          <TouchableOpacity onPress={() => setGalleryIndex(1)} style={flexGrow}>
            {renderGalleryItem(1)}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setGalleryIndex(2)} style={marginVertical}>
            {renderGalleryItem(2)}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setGalleryIndex(3)} style={flexGrow}>
            {renderGalleryItem(3)}

            {galleryFormatted.length - 4 > 0 && (
              <View style={moreGalleryWrapperStyles}>
                <View style={moreGalleryInnerWrapperStyles}>
                  <CText color={"white"} fontSize={18} textAlign="center">{`${
                    galleryFormatted.length - 4
                  }+`}</CText>
                  <CText color={"white"} fontSize={14} textAlign="center">
                    {t("other_gallery.humanized", { count: galleryFormatted.length - 4 })}
                  </CText>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [
    gridWrapperStyle,
    bigFlexMarginBottom,
    renderGalleryItem,
    columnFlexMarginLeftStyle,
    flexGrow,
    marginVertical,
    galleryFormatted.length,
    moreGalleryWrapperStyles,
    moreGalleryInnerWrapperStyles,
    t,
    setGalleryIndex
  ]);

  const renderFifthItemsGridVertical = useCallback(() => {
    //
    return (
      <View style={gridWrapperStyle}>
        <View style={bigFlexMarginBottom}>
          <TouchableOpacity onPress={() => setGalleryIndex(0)} style={marginBottom}>
            {renderGalleryItem(0)}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setGalleryIndex(1)} style={marginTop}>
            {renderGalleryItem(1)}
          </TouchableOpacity>
        </View>

        <View style={columnFlexMarginLeftStyle}>
          <TouchableOpacity onPress={() => setGalleryIndex(2)} style={flexGrow}>
            {renderGalleryItem(2)}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setGalleryIndex(3)} style={marginVertical}>
            {renderGalleryItem(3)}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setGalleryIndex(4)} style={flexGrow}>
            {renderGalleryItem(4)}

            {galleryFormatted.length - 5 > 0 && (
              <View style={moreGalleryWrapperStyles}>
                <View style={moreGalleryInnerWrapperStyles}>
                  <CText color={"white"} fontSize={18} textAlign="center">{`${
                    galleryFormatted.length - 5
                  }+`}</CText>
                  <CText color={"white"} fontSize={14} textAlign="center">
                    {t("other_gallery.humanized", { count: galleryFormatted.length - 5 })}
                  </CText>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [
    gridWrapperStyle,
    bigFlexMarginBottom,
    marginBottom,
    renderGalleryItem,
    marginTop,
    columnFlexMarginLeftStyle,
    flexGrow,
    marginVertical,
    galleryFormatted.length,
    moreGalleryWrapperStyles,
    moreGalleryInnerWrapperStyles,
    t,
    setGalleryIndex
  ]);

  const renderFifthItemsGridHorizontal = useCallback(() => {
    return (
      <View style={gridWrapperColumnStyle}>
        <View style={bigFlexMarginBottomRow}>
          <TouchableOpacity onPress={() => setGalleryIndex(0)} style={marginRight}>
            {renderGalleryItem(0)}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setGalleryIndex(1)} style={marginLeft}>
            {renderGalleryItem(1)}
          </TouchableOpacity>
        </View>

        <View style={rowFlex}>
          <TouchableOpacity onPress={() => setGalleryIndex(2)} style={flexGrow}>
            {renderGalleryItem(2)}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setGalleryIndex(3)} style={marginHorizontal}>
            {renderGalleryItem(3)}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setGalleryIndex(4)} style={flexGrow}>
            {renderGalleryItem(4)}

            {galleryFormatted.length - 5 > 0 && (
              <View style={moreGalleryWrapperStyles}>
                <View style={moreGalleryInnerWrapperStyles}>
                  <CText color={"white"} fontSize={18} textAlign="center">{`${
                    galleryFormatted.length - 5
                  }+`}</CText>
                  <CText color={"white"} fontSize={14} textAlign="center">
                    {t("other_gallery.humanized", { count: galleryFormatted.length - 5 })}
                  </CText>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [
    gridWrapperColumnStyle,
    bigFlexMarginBottomRow,
    marginRight,
    renderGalleryItem,
    marginLeft,
    rowFlex,
    flexGrow,
    marginHorizontal,
    galleryFormatted.length,
    moreGalleryWrapperStyles,
    moreGalleryInnerWrapperStyles,
    t,
    setGalleryIndex
  ]);

  const galleryRenderer = useCallback(() => {
    switch (totalImages) {
      case 0:
        return <View />;
      case 1:
        return renderFullGrid();
      case 2:
        return renderTwoItemsGrid();
      case 3:
        return galleryMode === GalleryLayoutType.VERTICAL ||
          galleryMode === GalleryLayoutType.PORTRAIT
          ? renderThreeItemsGridVertical()
          : renderThreeItemsGridHorizontal();
      case 4:
        return galleryMode === GalleryLayoutType.PORTRAIT
          ? renderFourPlusItemsGridPortrait()
          : galleryMode === GalleryLayoutType.LANDSCAPE
          ? renderFourPlusItemsGridLandscape()
          : galleryMode === GalleryLayoutType.VERTICAL
          ? renderFourPlusItemsGridPortrait()
          : renderFourPlusItemsGridLandscape();

      default:
        return galleryMode === GalleryLayoutType.PORTRAIT
          ? renderFourPlusItemsGridPortrait()
          : galleryMode === GalleryLayoutType.LANDSCAPE
          ? renderFourPlusItemsGridLandscape()
          : galleryMode === GalleryLayoutType.VERTICAL
          ? renderFifthItemsGridVertical()
          : renderFifthItemsGridHorizontal();
    }
  }, [
    galleryMode,
    renderFifthItemsGridHorizontal,
    renderFifthItemsGridVertical,
    renderFullGrid,
    renderThreeItemsGridHorizontal,
    renderThreeItemsGridVertical,
    renderTwoItemsGrid,
    renderFourPlusItemsGridLandscape,
    renderFourPlusItemsGridPortrait,
    totalImages
  ]);

  return <View style={flexGrow}>{galleryRenderer()}</View>;
};

export default memo(PostGallery, isEqual);
