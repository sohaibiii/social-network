import React, { memo, useCallback } from "react";
import { ScrollView, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { useSelector, useDispatch } from "react-redux";

import styles from "./Post.styles";
import { PostType } from "./Post.types";

import { RootState } from "~/redux/store";

import { postService } from "~/apiServices/index";
import { CText, TagsCard } from "~/components/";
import { InlineReadMore } from "~/components/common/InlineReadMore";
import { InlineReadMoreMode } from "~/components/common/InlineReadMore/InlineReadMore.types";
import {
  LikeCommentShareContainer,
  PostInsight,
  PostHeader,
  PostGallery
} from "~/components/post";
import { APP_SCREEN_HEIGHT, APP_SCREEN_WIDTH } from "~/constants/variables";
import { postsSelectors, usersSelectors } from "~/redux/reducers/home.reducer";
import { postUpserted } from "~/redux/reducers/home.reducer";
import {
  LIKE_POST,
  LIKE_POST_FAILED,
  LIKE_POST_SUCCESS,
  logEvent,
  UNLIKE_POST,
  UNLIKE_POST_FAILED,
  UNLIKE_POST_SUCCESS
} from "~/services/analytics";
import { playSoundFile } from "~/services/soundPlayer";
import { scale } from "~/utils/";

const ANALYTICS_SOURCE = "post";
const Post = (props: PostType): JSX.Element => {
  const { postPkey, isInsidePostDetails = false } = props;

  const postDetails =
    useSelector((state: RootState) => postsSelectors.selectById(state, postPkey)) || {};

  const userDetails =
    useSelector(
      (state: RootState) =>
        !!postDetails?.created_by &&
        usersSelectors.selectById(state, postDetails?.created_by)
    ) || {};

  const enable_sounds =
    useSelector(
      (state: RootState) => state.auth?.userProfile?.preferences?.enable_sounds
    ) || false;

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const userSelector = useSelector(
    (state: RootState) => state.home.users.entities[userDetails.uuid]
  );
  const postSelector = useSelector(
    (state: RootState) => state.home.posts.entities[postPkey]
  );

  const userToken = useSelector((state: RootState) => state.auth.userToken);

  const {
    name = "",
    profile = "",
    uuid = "",
    isFollow = false,
    verified = false,
    roles = []
  } = userSelector || {};

  const {
    text,
    gallery = [],
    tags = [],
    timestamp,
    views_count = 0,
    comments_counter = 0,
    likes = 0,
    pkey = "",
    place,
    is_my_post = false,
    isLiked = false
  } = postSelector || {};

  const theme = useTheme();

  const HEIGHT_SCALE = 1.8;
  const HEIGHT =
    !gallery || gallery?.length === 0
      ? 0
      : gallery?.length === 1
      ? gallery[0]?.type === "video"
        ? Math.min(
            (gallery[0]?.heightInPx / gallery[0]?.widthInPx) * APP_SCREEN_WIDTH,
            APP_SCREEN_HEIGHT / 1.6
          )
        : (gallery[0]?.height / gallery[0]?.width) * APP_SCREEN_WIDTH
      : APP_SCREEN_HEIGHT / HEIGHT_SCALE;

  const {
    postWrapperStyle,
    tagsStyle,
    tagsContentContainerStyle,
    galleryWrapperStyle,
    postTextStyle,
    relatedPlacesStyle
  } = styles(theme, HEIGHT);

  const handleLikePressed = useCallback(
    async liked => {
      if (!userToken) {
        return navigation.navigate("PreLoginNavigationModal");
      }
      if (liked) {
        if (enable_sounds) {
          playSoundFile("like.mp3");
        }
        await logEvent(LIKE_POST, {
          source: ANALYTICS_SOURCE,
          pkey,
          timestamp,
          is_inside_post_details: isInsidePostDetails
        });
        dispatch(postUpserted({ ...postSelector, isLiked: true, likes: likes + 1 }));
        postService
          .likePost(pkey, timestamp)
          .then(() => {
            return logEvent(LIKE_POST_SUCCESS, {
              source: ANALYTICS_SOURCE,
              pkey,
              timestamp,
              is_inside_post_details: isInsidePostDetails
            });
          })
          .catch(() => {
            dispatch(postUpserted({ ...postSelector, isLiked: false, likes: likes - 1 }));
            return logEvent(LIKE_POST_FAILED, {
              source: ANALYTICS_SOURCE,
              pkey,
              timestamp,
              is_inside_post_details: isInsidePostDetails
            });
          });
      } else {
        await logEvent(UNLIKE_POST, {
          source: ANALYTICS_SOURCE,
          pkey,
          timestamp,
          is_inside_post_details: isInsidePostDetails
        });
        dispatch(postUpserted({ ...postSelector, isLiked: false, likes: likes - 1 }));
        postService
          .unlikePost(pkey, timestamp)
          .then(() => {
            return logEvent(UNLIKE_POST_SUCCESS, {
              source: ANALYTICS_SOURCE,
              pkey,
              timestamp,
              is_inside_post_details: isInsidePostDetails
            });
          })
          .catch(() => {
            dispatch(postUpserted({ ...postSelector, isLiked: true, likes: likes + 1 }));
            return logEvent(UNLIKE_POST_FAILED, {
              source: ANALYTICS_SOURCE,
              pkey,
              timestamp,
              is_inside_post_details: isInsidePostDetails
            });
          });
      }
    },
    [pkey, timestamp, postSelector, dispatch, likes, navigation, userToken, enable_sounds]
  );

  if (!postSelector) {
    return <></>;
  }
  return (
    <View style={postWrapperStyle}>
      <PostHeader
        pkey={pkey}
        place={place}
        timestamp={timestamp}
        name={name}
        profile_image={profile}
        uuid={uuid}
        isMyPost={is_my_post}
        isFollow={isFollow}
        tags={tags}
        gallery={gallery}
        text={text}
        verified={verified}
        roles={roles}
        isInsidePostDetails={isInsidePostDetails}
      />

      <InlineReadMore
        maxNumberOfLinesToShow={5}
        isAutoLink
        mode={InlineReadMoreMode.FLEX}
        textProps={{
          color: "black",
          style: postTextStyle
        }}
        key={text}
        analyticsSource={ANALYTICS_SOURCE}
        pkey={pkey}
      >
        {text}
      </InlineReadMore>
      <View style={galleryWrapperStyle}>
        <PostGallery gallery={gallery} pkey={pkey} timestamp={timestamp} />
      </View>
      {tags.length > 0 && (
        <CText fontSize={16} style={relatedPlacesStyle}>
          {`${t("post_related_places")}:`}
        </CText>
      )}
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        style={tagsStyle}
        contentContainerStyle={tagsContentContainerStyle}
      >
        {tags.map((item: PostType, index: number) => (
          <TagsCard
            key={item.pkey}
            tag={item}
            tagsLength={tags.length}
            index={index}
            isInsidePostDetails={isInsidePostDetails}
          />
        ))}
      </ScrollView>
      <PostInsight
        views_count={views_count}
        comments_counter={comments_counter}
        likes={likes}
        pkey={pkey}
        is_my_post={is_my_post}
        timestamp={timestamp}
        isInsidePostDetails={isInsidePostDetails}
      />
      <LikeCommentShareContainer
        pkey={pkey}
        timestamp={timestamp}
        text={text}
        gallery={gallery}
        isLiked={isLiked}
        onLikePressed={handleLikePressed}
        comments_counter={comments_counter}
        isInsidePostDetails={isInsidePostDetails}
      />
    </View>
  );
};

export default memo(Post);
