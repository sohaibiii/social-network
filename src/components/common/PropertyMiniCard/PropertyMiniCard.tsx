import React from "react";
import { TouchableOpacity, View } from "react-native";

import Config from "react-native-config";
import { useTheme } from "react-native-paper";
import { useSelector } from "react-redux";

import { propertyMiniCardStyle } from "./PropertyMiniCard.style";
import { CountryAndRegionProps } from "./PropertyMiniCard.types";

import { RootState } from "~/redux/store";

import { CText, ProgressiveImage, RatingBar } from "~/components/";
import { RatingComponentTypes } from "~/components/common/RatingBar/RatingComponent/RatingComponent.types";
import { isRTL } from "~/constants/variables";
import { scale } from "~/utils/";

const PropertyMiniCard = (props: CountryAndRegionProps): JSX.Element => {
  const {
    item,
    setSelectionCb = () => undefined,
    hasRating = false,
    selected = false,
    index
  } = props;
  const { colors } = useTheme();
  const {
    title = { ar: "", en: "", fr: "" },
    country = { name: "", ar: "", slug: "", pkey: "" },
    city = { slug: "", pkey: "" },
    region = { name: "", ar: "" },
    type
  } = item;
  const cityOrRegionName = city?.name ?? city?.ar ?? region?.name ?? region?.ar ?? "";
  const language = useSelector((state: RootState) => state.settings.language || "ar");

  const {
    containerStyle,
    textContainerStyle,
    propertyImageStyle,
    ratingBarStyle,
    titleTextStyle,
    titleWrapperStyle
  } = propertyMiniCardStyle(selected, colors, type);

  const textColor = selected ? "primary_blue" : "gray";

  const handleSelected = () => {
    setSelectionCb(item);
  };

  const ratingCount = Number(item.rate?.rate_calculated ?? item.rate?.rating ?? 0);
  const numberPrefix = `${index + 1}. `;
  return (
    <TouchableOpacity onPress={handleSelected} style={containerStyle}>
      <ProgressiveImage
        source={{
          uri: `${Config.CONTENT_MEDIA_PREFIX}/${item?.featured_image?.image_uuid}_sm.jpg`
        }}
        style={propertyImageStyle}
        thumbnailSource={{
          uri: `${Config.CONTENT_MEDIA_PREFIX}/${item?.featured_image?.image_uuid}_xs.jpg`
        }}
      />
      <View style={textContainerStyle}>
        <View style={titleWrapperStyle}>
          <CText style={titleTextStyle} lineHeight={16} fontSize={14} color={textColor}>
            {(!!index || index === 0) && (
              <CText lineHeight={16} fontSize={14} fontFamily="medium">
                {numberPrefix}
              </CText>
            )}
            {title[language as "ar" | "en" | "fr"] || title.ar}
          </CText>
        </View>

        <CText lineHeight={12} fontSize={10} color={textColor}>{`${
          country.name ?? country.ar
        } ${cityOrRegionName && `- ${cityOrRegionName}`}`}</CText>
        {hasRating && (
          <RatingBar
            containerStyle={ratingBarStyle}
            ratingCount={5}
            defaultValue={ratingCount}
            type={RatingComponentTypes.STAR}
            size={scale(16)}
            spacing={2}
            disabled
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default PropertyMiniCard;
