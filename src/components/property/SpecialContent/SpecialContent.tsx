import React, { memo } from "react";
import { View } from "react-native";

import { useTranslation } from "react-i18next";
import Config from "react-native-config";
import { useTheme, Button, Card } from "react-native-paper";

import styles from "./SpecialContent.styles";
import { SpecialContentType } from "./SpecialContent.types";

import { CText } from "~/components/common";
import { VideoPreview } from "~/components/post";
import { openURL } from "~/services/inappbrowser/inappbrowser";

const SpecialContent = (props: SpecialContentType): JSX.Element => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { currency, description, image, label, link, price } = props;
  const { id, type, format = ".mp4", thumbnail } = image;

  const url =
    type === "image"
      ? `${Config.CONTENT_MEDIA_PREFIX}/${id}_md.jpg`
      : `${Config.VIDEOS_MEDIA_PREFIX}/${id}/${id}${format}`;

  const videoThumbnail = thumbnail
    ? `${Config.VIDEOS_MEDIA_PREFIX}/${id}/${id}.${thumbnail}`
    : "";

  const handleVisitUrl = (websiteUrl: string) => {
    openURL(websiteUrl);
  };

  const {
    cardWrapperStyle,
    cardCoverStyle,
    cardContentStyle,
    cardActionStyle,
    buttonStyle,
    buttonLabelStyle
  } = styles(theme);

  return (
    <View>
      <Card style={cardWrapperStyle}>
        {type === "image" ? (
          <Card.Cover source={{ uri: url }} style={cardCoverStyle} />
        ) : (
          <VideoPreview uri={url} thumbnail={videoThumbnail} />
        )}
        <Card.Content style={cardContentStyle}>
          <CText numberOfLines={3} fontSize={14}>
            {description}
          </CText>
        </Card.Content>
        <Card.Actions style={cardActionStyle}>
          <CText fontSize={16}>{`${price} ${currency}`}</CText>
          <Button
            mode="outlined"
            style={buttonStyle}
            labelStyle={buttonLabelStyle}
            onPress={() => handleVisitUrl(link)}
          >
            {label}
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

export default memo(SpecialContent);
