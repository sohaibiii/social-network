import React, { memo, useCallback, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import isEqual from "react-fast-compare";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, useTheme } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import Share from "react-native-share";

import LikeCommentShareContainerStyles from "./LikeCommentShareContainer.style";
import { LikeCommentShareContainerProps } from "./LikeCommentShareContainer.types";

import { CText, Icon, IconTypes } from "~/components/common";
import {
  logEvent,
  SHARE_POST_INITIATED,
  SHARE_POST_FAILED,
  SHARE_POST_SUCCESS,
  NAVIGATE_TO_POST_DETAILS
} from "~/services/analytics";
import {
  DynamicLinksAction,
  handleCreateShareLink,
  showShareView
} from "~/services/rnFirebase/dynamicLinks";
import { logError, moderateScale } from "~/utils/";
import { textEllipsis } from "~/utils/stringUtil";
const ANALYTICS_SOURCE = "post";

const LikeCommentShareContainer = (
  props: LikeCommentShareContainerProps
): JSX.Element => {
  const {
    onLikePressed = () => undefined,
    isLiked,
    pkey,
    timestamp,
    text,
    gallery = [],
    comments_counter = 0,
    isInsidePostDetails = false,
    isSponsorship = false,
    enable_post_actions,
    website
  } = props;

  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [isLoadingShare, setIsLoadingShare] = useState(false);

  const {
    container,
    likeCommentContainerStyle,
    likeCommentButtonContainerStyle,
    likeCommentTextStyle
  } = LikeCommentShareContainerStyles(colors);

  const handleLikePressed = useCallback(() => {
    onLikePressed(!isLiked, isSponsorship);
  }, [isLiked, onLikePressed, isSponsorship]);

  const handleSharePressed = async () => {
    setIsLoadingShare(true);
    await logEvent(SHARE_POST_INITIATED, {
      source: ANALYTICS_SOURCE,
      pkey,
      timestamp,
      is_inside_post_details: isInsidePostDetails
    });
    if (isSponsorship) {
      const shareOptions = {
        title: "Share via",
        message: `${textEllipsis(`${text}`, 40)}`,
        url: website
      };
      return Share.open(shareOptions)
        .then(() => {
          return logEvent(SHARE_POST_SUCCESS, {
            source: ANALYTICS_SOURCE,
            pkey,
            timestamp,
            is_inside_post_details: isInsidePostDetails
          });
        })
        .catch(error => {
          logError(
            `Error: handleCreateShareLink sponsership --LikeCommentShareContainer.tsx-- pkey=${pkey} timestamp=${timestamp} ${error}`
          );
          return logEvent(SHARE_POST_FAILED, {
            source: ANALYTICS_SOURCE,
            pkey,
            timestamp,
            is_inside_post_details: isInsidePostDetails
          });
        })
        .finally(() => {
          setIsLoadingShare(false);
        });
    }
    handleCreateShareLink({
      action: DynamicLinksAction.POST,
      title: t("safarway"),
      description: text,
      image: gallery.length > 0 && gallery[0],
      params: {
        pkey,
        timestamp
      }
    })
      .then(link => {
        return showShareView(link);
      })
      .then(shareRes => {
        return logEvent(SHARE_POST_SUCCESS, {
          source: ANALYTICS_SOURCE,
          pkey,
          timestamp,
          is_inside_post_details: isInsidePostDetails,
          ...shareRes
        });
      })
      .catch(error => {
        logError(
          `Error: handleCreateShareLink --LikeCommentShareContainer.tsx-- pkey=${pkey} timestamp=${timestamp} ${error}`
        );
        return logEvent(SHARE_POST_FAILED, {
          source: ANALYTICS_SOURCE,
          pkey,
          timestamp,
          is_inside_post_details: isInsidePostDetails
        });
      })
      .finally(() => {
        setIsLoadingShare(false);
      });
  };

  const handleOnCommentPressed = useCallback(async () => {
    await logEvent(NAVIGATE_TO_POST_DETAILS, {
      source: ANALYTICS_SOURCE,
      post_pkey: pkey,
      comments_counter: comments_counter,
      timestamp: timestamp,
      is_inside_post_details: isInsidePostDetails,
      type: "post_like_comment_share_container_comments_button"
    });

    navigation.navigate("PostDetails", {
      postPkey: pkey,
      commentsCounter: comments_counter,
      timestamp: timestamp,
      fromComments: true,
      isSponserShip: isSponsorship,
      enable_post_actions: enable_post_actions
    });
  }, [
    navigation,
    pkey,
    comments_counter,
    timestamp,
    isSponsorship,
    enable_post_actions,
    isInsidePostDetails
  ]);

  return (
    <View style={container}>
      <View style={likeCommentContainerStyle}>
        <TouchableOpacity
          style={likeCommentButtonContainerStyle}
          onPress={handleLikePressed}
        >
          <Icon
            type={IconTypes.SAFARWAY_ICONS}
            name={isLiked ? "like_selected" : "like"}
            width={RFValue(16)}
            height={RFValue(16)}
          />
          <CText fontSize={11} lineHeight={15} style={likeCommentTextStyle}>
            {t("like")}
          </CText>
        </TouchableOpacity>
        <TouchableOpacity
          style={likeCommentButtonContainerStyle}
          onPress={handleOnCommentPressed}
        >
          <Icon
            type={IconTypes.SAFARWAY_ICONS}
            name={"comment"}
            width={RFValue(16)}
            height={RFValue(16)}
          />
          <CText fontSize={11} lineHeight={15} style={likeCommentTextStyle}>
            {t("comments.humanized", {
              count: comments_counter
            })}{" "}
          </CText>
        </TouchableOpacity>
      </View>
      {isLoadingShare ? (
        <ActivityIndicator color={colors.text} size={moderateScale(16)} />
      ) : (
        <TouchableOpacity onPress={handleSharePressed}>
          <Icon
            type={IconTypes.SIMPLELINE_ICONS}
            name={"share"}
            size={moderateScale(16)}
            color={colors.text}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};
export default memo(LikeCommentShareContainer, isEqual);
