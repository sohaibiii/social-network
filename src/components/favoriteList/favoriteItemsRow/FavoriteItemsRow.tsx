import React, { FC, memo, useRef } from "react";
import { TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/core";
import Config from "react-native-config";
import { useTheme } from "react-native-paper";
import { useSelector } from "react-redux";

import { FavouiteItemsMenu } from "../";
import favouriteItemsStyles from "../favoriteItems/favoriteItems.styles";

import { FavoriteItemsRowProps } from "./favoriteItemsRow.types";

import { RootState } from "~/redux/store";

import { CText, ProgressiveImage, RatingBar } from "~/components/common";
import { RatingComponentTypes } from "~/components/common/RatingBar/RatingComponent/RatingComponent.types";
import { propertiesSelectors } from "~/redux/selectors/favorite";
import { NAVIGATE_TO_PROPERTY, logEvent } from "~/services/";
import { scale } from "~/utils/";

const FavoriteItemsRow: FC<FavoriteItemsRowProps> = ({ id, skey, setIsVisible }) => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const {
    root,
    itemRightContainer,
    itemImageStyle,
    itemContent,
    itemLocationStyle,
    ratingStyle
  } = favouriteItemsStyles(colors);

  const item = useSelector((state: RootState) =>
    propertiesSelectors.selectById(state, id)
  );
  const language = useSelector((state: RootState) => state.settings.language || "ar");

  const { region, country, featured_image, rate, pkey, slug, title } = item || {};
  const regionName = region?.name ? region?.name + " -" : "";
  const countryName = country?.name;

  const handleVisitProperty = async (slug: string) => {
    await logEvent(NAVIGATE_TO_PROPERTY, {
      source: "favorite_items_row",
      slug
    });
    return navigation.navigate("Property", { slug });
  };

  return (
    <TouchableOpacity style={root} onPress={() => handleVisitProperty(slug)}>
      <View style={itemRightContainer}>
        <ProgressiveImage
          source={{
            uri: `${Config.CONTENT_MEDIA_PREFIX}/${featured_image?.image_uuid}_xs.jpg`
          }}
          style={itemImageStyle}
        />
        <View style={itemContent}>
          <CText fontSize={14} color="black">
            {title[language]}
          </CText>

          <View style={ratingStyle}>
            <RatingBar
              ratingCount={5}
              defaultValue={Number(rate?.rate_calculated)}
              type={RatingComponentTypes.STAR}
              spacing={2}
              size={scale(16)}
              disabled
            />
          </View>
          <View style={itemLocationStyle}>
            {country?.name && (
              <CText fontSize={13} color="gray" numberOfLines={1} fontFamily="thin">
                {`${regionName} ${countryName}`}
              </CText>
            )}
          </View>
        </View>
      </View>
      <FavouiteItemsMenu pkey={pkey} skey={skey} setIsVisible={setIsVisible} />
    </TouchableOpacity>
  );
};

export default memo(FavoriteItemsRow);
