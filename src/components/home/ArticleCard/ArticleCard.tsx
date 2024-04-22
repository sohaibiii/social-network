import React, { memo, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";

import { useNavigation } from "@react-navigation/native";
import Config from "react-native-config";
import FastImage from "react-native-fast-image";
import { useTheme, Badge } from "react-native-paper";

import styles from "./ArticleCard.styles";
import { ArticleCardProps } from "./ArticleCard.type";

import { Category } from "~/apiServices/article/article.types";
import IMAGES from "~/assets/images";
import { ProgressiveImage, CText } from "~/components/common";
import { APP_SCREEN_WIDTH, APP_SCREEN_HEIGHT } from "~/constants/variables";
import { AppStackRoutesArticleDetailsProps } from "~/router/AppStackRoutes/AppStackRoutes.type";
import { logEvent, ARTICLE_VISITED } from "~/services/analytics";
import { logError } from "~/utils/";

const ArticleCard = (props: ArticleCardProps): JSX.Element => {
  const {
    title,
    language,
    featured_image,
    slug,
    shouldRenderProgressive = false,
    //   must be dynamic from backend
    travel_categories: travelCategories = [
      { name: "استكشاف", id: 19 },
      { name: "الطبيعة", id: 9 },
      { name: "الرياضة", id: 4 },
      { name: "التسوق", id: 3 },
      { name: "استكشاف", id: 19 }
    ],
    analyticsSource
  } = props;

  useEffect(() => {
    if (!featured_image?.image_uuid) {
      logError(`Error: Featured image --ArticleCard.tsx-- slug=${slug}`);
    }
  }, []);

  const theme = useTheme();
  const navigation = useNavigation<AppStackRoutesArticleDetailsProps["navigation"]>();

  const imageSource = `${Config.CONTENT_MEDIA_PREFIX}/${featured_image.image_uuid}_sm.jpg`;
  const thumbnailSource = `${Config.CONTENT_MEDIA_PREFIX}/${featured_image.image_uuid}_xs.jpg`;
  const WIDTH = (4 / 5) * APP_SCREEN_WIDTH;
  const HEIGHT = (1.2 / 5) * APP_SCREEN_HEIGHT;

  const handleArticlePressed = async () => {
    await logEvent(ARTICLE_VISITED, { title: title.en, slug, source: analyticsSource });
    navigation.navigate("ArticleDetails", { title, slug });
  };

  const {
    cardWrapperStyle,
    cardCoverStyle,
    cardContentWrapperStyle,
    badgeWrapperStyle,
    badgeStyle
  } = styles(theme, WIDTH, HEIGHT);

  return (
    <TouchableOpacity onPress={handleArticlePressed} style={cardWrapperStyle}>
      {shouldRenderProgressive ? (
        <ProgressiveImage
          source={{
            uri: imageSource
          }}
          thumbnailSource={{
            uri: thumbnailSource
          }}
          errorSource={IMAGES.placeholder}
          style={cardCoverStyle}
        />
      ) : (
        <FastImage
          style={cardCoverStyle}
          borderRadius={5}
          source={{
            uri: imageSource
          }}
        />
      )}

      <View style={cardContentWrapperStyle}>
        <View style={badgeWrapperStyle}>
          {travelCategories?.slice(0, 4).map((category: Category, index) => {
            const { id, name } = category;
            return (
              <Badge key={`${id}-${index}`} style={badgeStyle}>
                {name}
              </Badge>
            );
          })}
        </View>
        <CText color="black" fontSize={16} textAlign="left" numberOfLines={2}>
          {title[language]}
        </CText>
      </View>
    </TouchableOpacity>
  );
};

export default memo(ArticleCard);
