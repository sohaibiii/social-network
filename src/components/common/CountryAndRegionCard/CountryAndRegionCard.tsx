import React from "react";
import { TouchableOpacity, View } from "react-native";

import Config from "react-native-config";
import { useTheme } from "react-native-paper";

import { countryAndRegionCardStyle } from "./CountryAndRegionCard.style";
import { CountryAndRegionProps } from "./CountryAndRegionCard.types";

import { CText, ProgressiveImage } from "~/components/";

const CountryAndRegionCard = (props: CountryAndRegionProps): JSX.Element => {
  const { item, setSelectionCb = () => undefined, selected = false } = props;
  const { colors } = useTheme();
  const {
    title = { ar: "" },
    pkey = "",
    country = { name: "", ar: "", slug: "", pkey: "" },
    city = { slug: "", pkey: "" },
    region = { name: "", ar: "" }
  } = item;
  const cityOrRegionName = city?.name ?? city?.ar ?? region?.name ?? region?.ar ?? "";

  const { containerStyle, textContainerStyle, imageStyle } = countryAndRegionCardStyle(
    selected,
    colors
  );

  const textColor = selected ? "primary_blue" : "gray";

  const handleSelected = () => {
    setSelectionCb(pkey);
  };

  return (
    <TouchableOpacity onPress={handleSelected} style={containerStyle}>
      <ProgressiveImage
        source={{
          uri: `${Config.CONTENT_MEDIA_PREFIX}/${item?.featured_image.image_uuid}_xs.jpg`
        }}
        thumbnailSource={{
          uri: `${Config.CONTENT_MEDIA_PREFIX}/${item?.featured_image.image_uuid}_xs.jpg`
        }}
        style={imageStyle}
      />
      <View style={textContainerStyle}>
        <CText lineHeight={16} fontSize={14} color={textColor}>
          {title.ar}
        </CText>
        <CText lineHeight={12} fontSize={10} color={textColor}>{`${
          country.name ?? country.ar
        } ${cityOrRegionName && `- ${cityOrRegionName}`}`}</CText>
      </View>
    </TouchableOpacity>
  );
};

export default CountryAndRegionCard;
