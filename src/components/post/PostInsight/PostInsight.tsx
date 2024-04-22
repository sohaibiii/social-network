import React, { memo } from "react";
import { TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";
import { useSelector } from "react-redux";

import postInsightStyles from "./PostInsight.style";

import { RootState } from "~/redux/store";

import { CText, Icon, IconTypes } from "~/components/common";
import { PostType } from "~/components/home/Post/Post.types";
import {
  logEvent,
  NAVIGATE_TO_POST_DETAILS,
  LIKES_LIST_POST_VISITED
} from "~/services/analytics";
import { scale } from "~/utils/";
import { pluralizeNumbers } from "~/utils/stringUtil";
const ANALYTICS_SOURCE = "post";

const PostInsight = (props: PostType): JSX.Element => {
  const {
    views_count = 0,
    comments_counter = 0,
    likes = 0,
    pkey,
    timestamp,
    isSponsorship = false,
    isInsidePostDetails,
    enable_post_actions,
    is_my_post = false
  } = props || {};

  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  const postSelector = useSelector((state: RootState) => state.home.posts.entities[pkey]);

  const { container, centeredRow, viewsContainerStyle, insightTextStyle } =
    postInsightStyles;

  const handleVisitLikesList = async () => {
    await logEvent(LIKES_LIST_POST_VISITED, {
      source: ANALYTICS_SOURCE,
      post_pkey: pkey,
      timestamp,
      type: "post_insight_comments_number",
      is_inside_post_details: isInsidePostDetails
    });
    return navigation.navigate({
      name: "LikesList",
      params: {
        postPkey: pkey,
        timestamp,
        title: t(is_my_post ? "likes_list_title" : "likes_list_title_other")
      },
      key: `${moment().unix()}`
    });
  };

  const handleGoToPostDetails = async () => {
    await logEvent(NAVIGATE_TO_POST_DETAILS, {
      source: ANALYTICS_SOURCE,
      post_pkey: pkey,
      comments_counter: postSelector?.comments_counter,
      timestamp: timestamp,
      type: "post_insight_comments_number",
      is_inside_post_details: isInsidePostDetails
    });
    navigation.navigate("PostDetails", {
      postPkey: pkey,
      commentsCounter: postSelector?.comments_counter,
      timestamp: timestamp,
      fromComments: true,
      isSponserShip: isSponsorship,
      enable_post_actions: enable_post_actions
    });
  };

  return (
    <View style={container}>
      <View style={centeredRow}>
        <TouchableOpacity
          style={centeredRow}
          onPress={handleVisitLikesList}
          disabled={likes === 0}
        >
          <Icon
            type={IconTypes.SAFARWAY_ICONS}
            name={"like_selected"}
            width={scale(14)}
            height={scale(14)}
          />
          <CText color={"gray"} style={insightTextStyle} fontSize={11}>
            {likes}
          </CText>
        </TouchableOpacity>
        {!isSponsorship && (
          <View style={viewsContainerStyle}>
            <Icon
              type={IconTypes.MATERIAL_COMMUNITY_ICONS}
              name={"eye"}
              color={colors.gray}
              size={scale(14)}
            />
            <CText color={"gray"} style={insightTextStyle} fontSize={11}>
              {pluralizeNumbers(views_count, "views")}
            </CText>
          </View>
        )}
      </View>
      <TouchableOpacity onPress={handleGoToPostDetails}>
        <CText fontFamily={"light"} color={"gray"} fontSize={12}>
          {t("comments.humanized", {
            count: comments_counter
          })}
        </CText>
      </TouchableOpacity>
    </View>
  );
};
export default memo(PostInsight);
