import React, { memo, useCallback, useState } from "react";
import { View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "~/redux/store";

import { postService } from "~/apiServices/index";
import { InViewport } from "~/components/common";
import { InlineReadMore } from "~/components/common/InlineReadMore";
import { InlineReadMoreMode } from "~/components/common/InlineReadMore/InlineReadMore.types";
import styles from "~/components/home/Post/Post.styles";
import { PostType } from "~/components/home/Post/Post.types";
import { LikeCommentShareContainer, PostInsight, PostGallery } from "~/components/post";
import {
  PostSponsershipFooter,
  PostSponsershipHeader
} from "~/components/postSponsership";
import { APP_SCREEN_HEIGHT, APP_SCREEN_WIDTH } from "~/constants/variables";
import { postsSelectors, usersSelectors } from "~/redux/reducers/home.reducer";
import { postUpserted } from "~/redux/reducers/home.reducer";
import { logEvent, SPONSERSHIP_VIEWED } from "~/services/";
import { playSoundFile } from "~/services/soundPlayer";
import { verticalScale } from "~/utils/responsivityUtil";

const PostSponsership = (props: PostType): JSX.Element => {
  const {
    pkey: postPkey,
    isInsidePostDetails = false,
    enable_post_actions = false
  } = props;

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
  const [isFirstTime, setIsFirstTime] = useState(true);
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
    isLiked = false,
    website,
    title,
    description
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
          ) || verticalScale(360)
        : (gallery[0]?.height / gallery[0]?.width) * APP_SCREEN_WIDTH
      : APP_SCREEN_HEIGHT / HEIGHT_SCALE;

  const {
    postWrapperStyle,
    galleryWrapperStyle,
    postTextStyle,
    noLikeCommentShareContainer
  } = styles(theme, HEIGHT);

  const handleLikePressed = useCallback(
    (liked, isSponsorship = false) => {
      if (!userToken) {
        return navigation.navigate("PreLoginNavigationModal");
      }
      if (liked) {
        if (enable_sounds) {
          playSoundFile("like.mp3");
        }
        postService.likePost(pkey, timestamp, isSponsorship);
        dispatch(postUpserted({ ...postSelector, isLiked: true, likes: likes + 1 }));
      } else {
        postService.unlikePost(pkey, timestamp);
        dispatch(postUpserted({ ...postSelector, isLiked: false, likes: likes - 1 }));
      }
    },
    [pkey, timestamp, postSelector, dispatch, likes, navigation, userToken]
  );

  const handlePostSponsershipViewed = useCallback(
    async isInViewport => {
      if (isInViewport && isFirstTime) {
        setIsFirstTime(false);
        await logEvent(SPONSERSHIP_VIEWED, {
          source: "post_sponsership",
          pkey: postPkey
        });
      }
    },
    [isFirstTime, postPkey]
  );

  if (!postSelector) {
    return <></>;
  }
  return (
    <InViewport disabled={!isFirstTime} onChange={handlePostSponsershipViewed}>
      <View style={postWrapperStyle}>
        <PostSponsershipHeader
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
        >
          {text}
        </InlineReadMore>
        <View style={galleryWrapperStyle}>
          <PostGallery gallery={gallery} isSponsorship link={tags?.link ?? ""} />
        </View>
        <PostSponsershipFooter
          tags={tags}
          description={description}
          title={title}
          website={website}
        />
        {enable_post_actions ? (
          <>
            <PostInsight
              views_count={views_count}
              comments_counter={comments_counter}
              likes={likes}
              pkey={pkey}
              timestamp={timestamp}
              isSponsorship
              enable_post_actions={postSelector?.preferences?.enable_post_actions}
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
              isSponsorship
              enable_post_actions={postSelector?.preferences?.enable_post_actions}
              website={website}
            />
          </>
        ) : (
          <View style={noLikeCommentShareContainer} />
        )}
      </View>
    </InViewport>
  );
};

export default memo(PostSponsership);
