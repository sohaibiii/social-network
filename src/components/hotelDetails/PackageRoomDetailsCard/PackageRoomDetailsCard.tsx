import React, { memo } from "react";
import { TouchableOpacity, View } from "react-native";

import { useTranslation } from "react-i18next";
import FastImage from "react-native-fast-image";
import { Card, useTheme } from "react-native-paper";
import { useSelector } from "react-redux";

import packageRoomDetailsCardStyle from "./PackageRoomDetailsCard.style";
import { VariationDetailsCardProps } from "./PackageRoomDetailsCard.types";

import { RootState } from "~/redux/store";

import IMAGES from "~/assets/images";
import { CText, Icon, IconTypes } from "~/components/common";
import { scale } from "~/utils/";

const PackageRoomDetailsCard = (props: VariationDetailsCardProps): JSX.Element => {
  const {
    room = {},
    onShowDescription = () => undefined,
    onShowGallery = () => undefined
  } = props;

  const { t } = useTranslation();
  const { colors } = useTheme();
  const isThemeDark = useSelector((state: RootState) => state.settings.isThemeDark);

  const {
    containerStyle,
    imageStyle,
    iconStyle,
    buttonsContainerStyle,
    showDescriptionContainerStyle,
    galleryIconStyle,
    variantTextStyle,
    iconsContainerStyle,
    row,
    flex,
    roomNameTextStyle
  } = packageRoomDetailsCardStyle;

  const { roomReferences = {}, occupancy } = room || {};
  const { adults = 0 } = occupancy || {};

  const {
    boardBasis = "",
    description,
    name: room_name,
    info,
    nonRefundable,
    images: roomImages = []
  } = roomReferences[0] || {};
  const image =
    roomImages?.length > 0 ? { uri: roomImages[0]?.url } : IMAGES.default_hotel;
  const images =
    roomImages?.length > 0 ? roomImages?.map(item => ({ uri: item?.url })) : [];

  let bedInfo = "";
  try {
    const bedInfoWithDot = info.split("Beds:")[1];
    bedInfo = bedInfoWithDot.replace(".", "");
  } catch (error) {
    bedInfo = "";
  }

  const nonRefundableTranslated = nonRefundable
    ? "hotels.roomFilters.nonrefundable"
    : "hotels.roomFilters.refundable";

  const nonRefundableTextColor = nonRefundable ? "red" : "green";

  return (
    <Card style={containerStyle}>
      <View style={row}>
        <View style={flex}>
          <TouchableOpacity
            disabled={images?.length === 0}
            onPress={() => onShowGallery(images)}
          >
            <FastImage style={imageStyle} resizeMode={"cover"} source={image} />
          </TouchableOpacity>
          <View style={galleryIconStyle}>
            <Icon
              name="image"
              size={scale(16)}
              color={colors.white}
              type={IconTypes.MATERIAL_COMMUNITY_ICONS}
            />
          </View>
          <CText color={"text"} fontSize={12} lineHeight={17} style={roomNameTextStyle}>
            {room_name}
          </CText>
          <CText fontSize={12} lineHeight={17} style={variantTextStyle}>
            {t(`hotels.board.${boardBasis}`)}
          </CText>
          <View style={iconsContainerStyle}>
            <View style={row}>
              <Icon
                name="person-outline"
                size={scale(16)}
                color={colors.gray}
                type={IconTypes.MATERIAL_ICONS}
              />
              <CText color={"gray"} fontSize={10} lineHeight={15} style={iconStyle}>
                {t("hotels.adults_humanized", {
                  count: parseInt(adults)
                })}
              </CText>
            </View>

            {!!bedInfo && (
              <View style={row}>
                <Icon
                  name="bed-outline"
                  size={scale(16)}
                  color={colors.gray}
                  type={IconTypes.ION_ICONS}
                />
                <CText color={"gray"} fontSize={10} lineHeight={15} style={iconStyle}>
                  {bedInfo}
                </CText>
              </View>
            )}
            <View style={row}>
              <Icon
                name="cash-multiple"
                size={scale(16)}
                color={colors.gray}
                type={IconTypes.MATERIAL_COMMUNITY_ICONS}
              />
              <CText color={nonRefundableTextColor} fontSize={10} style={iconStyle}>
                {t(nonRefundableTranslated)}
              </CText>
            </View>
          </View>
          <View style={buttonsContainerStyle}>
            {!!description && (
              <View style={showDescriptionContainerStyle}>
                <TouchableOpacity onPress={() => onShowDescription(description)}>
                  <CText color={"primary_reversed"} fontSize={12} lineHeight={14}>
                    {t("hotels.show_details")}
                  </CText>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </Card>
  );
};
export default memo(PackageRoomDetailsCard);
