import React, { memo, useMemo } from "react";
import { TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import Config from "react-native-config";
import FastImage from "react-native-fast-image";
import { useTheme } from "react-native-paper";
import { useSelector } from "react-redux";

import tagsCardStyles from "./TagsCard.styles";
import { PostType } from "./TagsCard.types";

import { RootState } from "~/redux/store";

import { CText, Icon, IconTypes, RatingBar } from "~/components/";
import { Favourite } from "~/components/property";
import { getPropertyById } from "~/redux/selectors";
import { AppStackRoutesCityCountryRegionProps } from "~/router/AppStackRoutes/AppStackRoutes.type";
import {
  logEvent,
  NAVIGATE_TO_CITY_COUNTRY_REGION,
  NAVIGATE_TO_PROPERTY
} from "~/services/";
import { moderateScale, scale } from "~/utils/";

const ANALYTICS_SOURCE = "post_tag_card";
const TagsCard = (props: PostType): JSX.Element => {
  const { tag: _tag, tagsLength = 1, index = 0, isInsidePostDetails = false } = props;

  const propertyByIdSelector = useMemo(() => getPropertyById(_tag.pkey), [_tag.pkey]);
  const property = useSelector((state: RootState) =>
    _tag?.type === "property" ? propertyByIdSelector(state) : null
  );
  const tag = property || _tag;

  const { colors } = useTheme();
  const navigation = useNavigation<AppStackRoutesCityCountryRegionProps["navigation"]>();
  const language = useSelector((state: RootState) => state.settings.language || "ar");

  const {
    containerStyle,
    imageStyle,
    ratingAndNameContainerStyle,
    favouriteIconStyle,
    lastTagContainerStyle
  } = tagsCardStyles(colors, moderateScale(60), moderateScale(80), tagsLength);

  const handleTagPressed = async () => {
    const { type, slug, title } = tag;
    if (property || type === "property") {
      await logEvent(NAVIGATE_TO_PROPERTY, {
        source: ANALYTICS_SOURCE,
        slug,
        is_inside_post_details: isInsidePostDetails
      });
      return navigation.navigate({
        name: "Property",
        params: { slug },
        key: `${moment().unix()}`
      });
    }
    await logEvent(NAVIGATE_TO_CITY_COUNTRY_REGION, {
      source: ANALYTICS_SOURCE,
      title,
      slug,
      type,
      is_inside_post_details: isInsidePostDetails
    });

    navigation.navigate({
      name: "CityCountryRegion",
      params: { title, slug, type },
      key: `${moment().unix()}`
    });
  };
  const tagContainerStyles = [
    containerStyle,
    tagsLength - 1 === index ? lastTagContainerStyle : {}
  ];
  return (
    <TouchableOpacity style={tagContainerStyles} onPress={handleTagPressed}>
      <FastImage
        style={imageStyle}
        source={{
          uri: `${Config.CONTENT_MEDIA_PREFIX}/${tag.featured_image?.image_uuid}_sm.jpg`
        }}
      />
      <View style={ratingAndNameContainerStyle}>
        <CText fontSize={12}>{_tag?.title[language]}</CText>
        {tag?.type === "city" && (
          <CText fontSize={11} color="gray" fontFamily="light">
            {tag?.country?.name}
          </CText>
        )}
        {_tag?.type === "property" && (
          <RatingBar
            disabled
            ratingCount={5}
            defaultValue={tag.rate?.rating}
            size={scale(16)}
            spacing={2}
          />
        )}
      </View>
      {_tag?.type === "property" && (
        <View style={favouriteIconStyle}>
          <Favourite
            size={moderateScale(22)}
            color={colors.grayBB}
            isFavorite={!!tag?.is_favorite}
            pkey={tag?.pkey}
          />
        </View>
        // <TouchableOpacity style={favouriteIconStyle}>
        //   <Icon
        //     type={IconTypes.MATERIAL_ICONS}
        //     name={tag?.is_favorite ? "favorite" : "favorite-border"}
        //     size={22}
        //     color={tag?.is_favorite ? colors.darkRed : colors.text}
        //   />
        // </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default memo(TagsCard);
