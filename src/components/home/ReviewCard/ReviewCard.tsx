import React, { FC, memo, useMemo, useState } from "react";
import { View, TouchableOpacity } from "react-native";

import { useNavigation } from "@react-navigation/core";
import moment from "moment";
import Config from "react-native-config";
import FastImage from "react-native-fast-image";
import { Avatar, useTheme } from "react-native-paper";
import { useSelector, shallowEqual } from "react-redux";

import reviewCardStyle from "./ReviewCard.styles";
import { ReviewCardProps } from "./ReviewCard.types";

import { RootState } from "~/redux/store";

import {
  CText,
  Icon,
  IconTypes,
  RatingBar,
  UserProfileAvatar
} from "~/components/common";
import { RatingComponentTypes } from "~/components/common/RatingBar/RatingComponent/RatingComponent.types";
import { Favourite } from "~/components/property";
import { getPropertyById } from "~/redux/selectors";
import { LATEST_REVIEW_PRESSED, logEvent } from "~/services/analytics";
import { moderateScale, scale } from "~/utils/responsivityUtil";

const ANALYTICS_SOURCE = "home_page_review_card";

const ReviewCard: FC<ReviewCardProps> = props => {
  const { item, language, onlyReview = false, analyticsSource } = props;

  const propertyByIdSelector = useMemo(() => getPropertyById(item.pkey), [item.pkey]);
  const property = useSelector(propertyByIdSelector, shallowEqual);

  const {
    index: date,
    title = { ar: "", en: "" },
    pkey,
    text,
    slug,
    created_by,
    rate,
    featured_image = {}
  } = item || {};
  const { is_favorite: isFavourite = false } = property || {};
  const { name, id, verified = false, roles = [] } = created_by || {};
  const { colors } = useTheme();
  const navigation = useNavigation();
  const userSelector = useSelector(
    (state: RootState) => state.home.users.entities[id],
    shallowEqual
  );
  const profile = userSelector?.profile ?? "";

  const profileSource = useMemo(
    () => ({ uri: userSelector?.profile }),
    [userSelector?.profile]
  );
  const propertySource = useMemo(
    () => ({
      uri: `${Config.CONTENT_MEDIA_PREFIX}/${featured_image?.image_uuid}_sm.jpg`
    }),
    [featured_image?.image_uuid]
  );
  const {
    containerStyle,
    imageContainerStyle,
    dataContainerStyle,
    nameStyle,
    ratingStyle,
    row,
    dividerStyle,
    userDetailsContainer,
    nameAndDateStyle,
    footerImageStyle,
    avatarLabelStyle,
    profileImageStyle
  } = useMemo(() => reviewCardStyle(colors, onlyReview), [colors, onlyReview]);

  const openProfileHandler = () => {
    navigation.navigate("Profile", {
      uuid: id,
      hasBackButton: true
    });
  };

  const openProperty = async () => {
    if (analyticsSource) {
      await logEvent(LATEST_REVIEW_PRESSED, {
        source: analyticsSource,
        reviewer_id: id,
        reviewer_name: name,
        pkey,
        rate,
        slug,
        text,
        title
      });
    }
    navigation.navigate("Property", { slug });
  };

  const isRahhal = roles.length > 0;

  return (
    <TouchableOpacity style={containerStyle} onPress={openProperty}>
      <View style={imageContainerStyle}>
        <FastImage source={propertySource} style={footerImageStyle} />
      </View>
      <View style={dataContainerStyle}>
        <View style={userDetailsContainer}>
          <UserProfileAvatar
            isRahhal={isRahhal}
            name={name}
            profile={profile}
            id={id}
            analyticsSource={ANALYTICS_SOURCE}
          />

          <View style={nameAndDateStyle}>
            <TouchableOpacity onPress={openProfileHandler} style={row}>
              {verified && (
                <Icon
                  type={IconTypes.SAFARWAY_ICONS}
                  name="verified_user_filled"
                  height={scale(15)}
                  width={scale(15)}
                />
              )}
              <CText
                numberOfLines={1}
                color="primary_blue_d"
                fontSize={14}
                style={nameStyle}
                lineHeight={19}
              >
                {name}
              </CText>
            </TouchableOpacity>
            <CText fontSize={11} lineHeight={16} fontFamily="light" color="grayReversed">
              {moment(date).fromNow()}
            </CText>
          </View>
          <View style={dividerStyle} />
          <Favourite color={colors.grayBB} isFavorite={isFavourite} pkey={pkey} />
        </View>
        <RatingBar
          ratingCount={5}
          defaultValue={rate}
          type={RatingComponentTypes.STAR}
          size={scale(16)}
          spacing={2}
          disabled
          containerStyle={ratingStyle}
        />
        <CText
          numberOfLines={1}
          color="text"
          fontSize={13}
          style={nameStyle}
          lineHeight={18}
        >
          {title[language as "ar" | "en" | "fr"]}
        </CText>
        <CText
          color="text"
          fontFamily="light"
          fontSize={11}
          style={nameStyle}
          numberOfLines={1}
          lineHeight={16}
        >
          {text}
        </CText>
      </View>
    </TouchableOpacity>
  );
};

export default memo(ReviewCard);
