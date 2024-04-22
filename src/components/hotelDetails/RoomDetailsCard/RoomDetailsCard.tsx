import React, { memo, useMemo, useCallback } from "react";
import { StatusBar, View, ScrollView, Pressable } from "react-native";

import { useDispatch } from "react-redux";

import roomDetailsCardStyle from "./RoomDetailsCard.style";
import { RoomDetailsCardProps } from "./RoomDetailsCard.types";

import { ArticleMarkdown } from "~/components/articles";
import { VariationDetailsCard } from "~/components/hotelDetails";
import { APP_SCREEN_HEIGHT } from "~/constants/";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import { showGalleryViewer } from "~/redux/reducers/galleryViewer.reducer";
import { logEvent, SHOW_ROOM_DESCRIPTION_PRESSED } from "~/services/analytics";

const RoomDetailsCard = (props: RoomDetailsCardProps): JSX.Element => {
  const { room, hotel, analyticsSource = "" } = props;

  const { packageRooms = {} } = room;
  const { roomReferences = {} } = packageRooms[0] || {};
  const { description, images = [] } = roomReferences[0] || {};

  const dispatch = useDispatch();

  const { containerStyle, descriptionStyle, markdownStyle } = useMemo(
    () => roomDetailsCardStyle,
    []
  );

  const imageList = useMemo(() => images?.map(image => ({ uri: image?.url })), [images]);
  const article = useMemo(() => ({ body: description }), [description]);
  const handleShowGallery = useCallback(() => {
    if (imageList.length === 0) {
      return;
    }
    dispatch(
      showGalleryViewer({
        data: imageList,
        isVisible: true,
        disableThumbnailPreview: false,
        currentIndex: 0
      })
    );
  }, [dispatch, imageList]);

  const DescriptionContent = useCallback(
    () => (
      <ScrollView style={descriptionStyle}>
        <Pressable>
          <ArticleMarkdown containerStyle={markdownStyle} article={article} />
        </Pressable>
      </ScrollView>
    ),
    [descriptionStyle, markdownStyle, article]
  );

  const handleShowDescription = useCallback(() => {
    dispatch(
      showBottomSheet({
        Content: DescriptionContent,
        scrollViewProps: null,
        props: {
          style: { marginTop: APP_SCREEN_HEIGHT * 0.15 + StatusBar?.currentHeight },
          scrollViewProps: null
        }
      })
    );
    return logEvent(SHOW_ROOM_DESCRIPTION_PRESSED, {
      source: analyticsSource,
      hotel_id: hotel?.id,
      hotel_name: hotel?.name,
      ...room
    });
  }, [DescriptionContent, dispatch]);

  return (
    <View style={containerStyle}>
      {packageRooms?.map((variation, index) => (
        <VariationDetailsCard
          onShowDescription={handleShowDescription}
          onShowGallery={handleShowGallery}
          key={`${variation.id}-${index}`}
          variation={variation}
          room={room}
          hotel={hotel}
        />
      ))}
    </View>
  );
};
export default memo(RoomDetailsCard);
