import React, { memo, useCallback, useMemo } from "react";
import {
  InteractionManager,
  LayoutAnimation,
  Platform,
  TouchableOpacity,
  UIManager,
  View
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import isEqual from "react-fast-compare";
import { useTranslation } from "react-i18next";
import Config from "react-native-config";
import { useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import LikeCommentShareContainerStyles from "./PostHeader.style";
import { PostHeaderTypes } from "./PostHeader.types";

import { RootState } from "~/redux/store";

import { userService, postService } from "~/apiServices/index";
import settingsService from "~/apiServices/settings";
import {
  CText,
  Icon,
  IconTypes,
  modalizeRef,
  UserProfileAvatar
} from "~/components/common";
import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import { ReportPostButton, ReportPostContent, ConfirmContent } from "~/components/post";
import { DestinationsType } from "~/containers/cityCountryRegion/CityCountryRegion.types";
import { followUser, unfollowUser } from "~/redux/reducers/auth.reducer";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import { setIsRefreshing } from "~/redux/reducers/home.reducer";
import { userUpserted, postDeleted } from "~/redux/reducers/home.reducer";
import { editPost } from "~/redux/reducers/propertySocialAction.reducer";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import {
  logEvent,
  NAVIGATE_TO_PROFILE,
  FOLLOW_USER,
  UNFOLLOW_USER,
  NAVIGATE_TO_POST_DETAILS,
  POST_OPEN_MORE_MENU,
  POST_BLOCK_USER,
  POST_BLOCK_USER_SUCCESS,
  POST_BLOCK_USER_FAILED,
  DELETE_POST,
  DELETE_POST_FAILED,
  DELETE_POST_SUCCESS,
  INITIATE_EDIT_MY_POST
} from "~/services/analytics";
import { translate } from "~/translations/";
import { generalErrorHandler, moderateScale, scale } from "~/utils/";

const ANALYTICS_SOURCE = "post";
const PostHeader = (props: PostHeaderTypes): JSX.Element => {
  const {
    pkey = "",
    place = {},
    name = "",
    profile_image = "",
    uuid = "",
    timestamp,
    isMyPost = false,
    isFollow = false,
    text,
    tags,
    gallery,
    verified,
    roles = [],
    isInsidePostDetails = false
  } = props || {};

  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userToken = useSelector((state: RootState) => state.auth.userToken);
  const postSelector = useSelector((state: RootState) => state.home.posts.entities[pkey]);

  const {
    container,
    userDetailsContainerStyle,
    userDetailsTextStyle,
    userDetailsStyle,
    row,
    actionsContainerStyle,
    followIconContainerStyle,
    followIconStyle,
    bottomSpacing,
    nameWrapperStyle,
    verifiecIconStyle,
    hoursRowStyle
  } = useMemo(() => LikeCommentShareContainerStyles(colors), [colors]);

  const handleGoToProfile = useCallback(async () => {
    await logEvent(NAVIGATE_TO_PROFILE, { source: ANALYTICS_SOURCE });
    navigation.navigate("Profile", {
      uuid,
      hasBackButton: true
    });
  }, [navigation, uuid]);

  const handleFollowPressed = async () => {
    try {
      if (!userToken) {
        return navigation.navigate("PreLoginNavigationModal");
      }
      dispatch(userUpserted({ id: uuid, isFollow: !isFollow }));
      await userService.followUser(uuid, !isFollow);
      if (isFollow) {
        await logEvent(UNFOLLOW_USER, { source: ANALYTICS_SOURCE, uuid });
        dispatch(unfollowUser({}));
      } else {
        await logEvent(FOLLOW_USER, { source: ANALYTICS_SOURCE, uuid });
        dispatch(followUser({}));
      }
    } catch (error) {
      dispatch(userUpserted({ id: uuid, isFollow: !isFollow }));
      generalErrorHandler(`Error: followUser --PostHeader.tsx uuid=${uuid} ${error}`);
    }
  };

  const handleMorePostSettingsPressed = useCallback(async () => {
    if (!userToken) {
      return navigation.navigate("PreLoginNavigationModal");
    }
    await logEvent(POST_OPEN_MORE_MENU, { source: ANALYTICS_SOURCE });
    dispatch(
      showBottomSheet({
        Content: bottomSheetContent,
        props: {
          useDynamicSnapPoints: true,
          flatListProps: null,
          HeaderComponent: null
        }
      })
    );
  }, [dispatch, bottomSheetContent, postSelector, navigation, userToken]);

  const handleDeletedCb = useCallback(() => {
    modalizeRef.current?.close();
    if (isInsidePostDetails) {
      navigation.goBack();
    }
  }, []);

  const renderDeletePostContent = useCallback(
    () => (
      <ConfirmContent
        onPress={handleDeletedCb}
        title={t("delete_post_success")}
        icon={
          <Icon
            type={IconTypes.SAFARWAY_ICONS}
            name="verified_user"
            width={scale(60)}
            height={scale(60)}
            color={"green"}
          />
        }
        confirmText={t("done")}
      />
    ),
    [t, handleDeletedCb]
  );

  const handleDeletePost = useCallback(async () => {
    await logEvent(DELETE_POST, { source: ANALYTICS_SOURCE, pkey, timestamp });
    postService
      .deletePost(pkey, timestamp)
      .then(() => {
        dispatch(postDeleted(pkey));
        dispatch(
          showBottomSheet({
            Content: renderDeletePostContent,
            props: {
              useDynamicSnapPoints: true,
              flatListProps: null
            }
          })
        );
        return logEvent(DELETE_POST_SUCCESS, {
          source: ANALYTICS_SOURCE,
          pkey,
          timestamp
        });
      })
      .catch(() => {
        dispatch(
          showSnackbar({
            text: translate("something_went_wrong"),
            type: SnackbarVariations.TOAST,
            duration: 2000,
            backgroundColor: "red"
          })
        );
        return logEvent(DELETE_POST_FAILED, {
          source: ANALYTICS_SOURCE,
          pkey,
          timestamp
        });
      });
  }, [dispatch, pkey, renderDeletePostContent, timestamp]);

  const renderBlockUserConfirmationContent = useCallback(
    () => (
      <ConfirmContent
        onPress={() => modalizeRef.current?.close()}
        title={t("block_user_success", {
          interpolation: { escapeValue: false },
          user: name
        })}
        icon={
          <Icon
            type={IconTypes.SAFARWAY_ICONS}
            name="verified_user"
            width={scale(60)}
            height={scale(60)}
            color={"green"}
          />
        }
        confirmText={t("done")}
      />
    ),
    [name, t]
  );

  const handleBlockUser = useCallback(async () => {
    await logEvent(POST_BLOCK_USER, { source: ANALYTICS_SOURCE, uuid });
    settingsService
      .blockUserRequest(uuid)
      .then(() => {
        dispatch(setIsRefreshing({}));

        dispatch(
          showBottomSheet({
            Content: renderBlockUserConfirmationContent,
            props: {
              useDynamicSnapPoints: true,
              flatListProps: null
            }
          })
        );
        isInsidePostDetails && navigation.goBack();
        return logEvent(POST_BLOCK_USER_SUCCESS, { source: ANALYTICS_SOURCE, uuid });
      })
      .catch(() => {
        dispatch(
          showSnackbar({
            text: translate("something_went_wrong"),
            type: SnackbarVariations.TOAST,
            duration: 2000,
            backgroundColor: "red"
          })
        );
        return logEvent(POST_BLOCK_USER_FAILED, { source: ANALYTICS_SOURCE, uuid });
      });
  }, [dispatch, renderBlockUserConfirmationContent, uuid]);

  const showReportBottomSheet = useCallback(() => {
    dispatch(
      showBottomSheet({
        Content: () => (
          <ReportPostContent onBackPressedCb={handleMorePostSettingsPressed} {...props} />
        ),
        props: {
          useDynamicSnapPoints: true,
          flatListProps: null
        },
        customProps: {
          scrollViewProps: {
            keyboardShouldPersistTaps: "handled",
            showsVerticalScrollIndicator: false
            // contentContainerStyle: scrollViewStyle
          }
        }
      })
    );
  }, [dispatch, handleMorePostSettingsPressed, props]);

  const renderBlockUserContent = useCallback(
    () => (
      <ConfirmContent
        title={t("block_user_description")}
        description={t("block_user_confirm", {
          interpolation: { escapeValue: false },
          user: name
        })}
        icon={
          <Icon
            type={IconTypes.MATERIAL_COMMUNITY_ICONS}
            disabled
            name={"block-helper"}
            color={colors.text}
            size={scale(40)}
          />
        }
        hasLoading={true}
        onPress={handleBlockUser}
        cancelText={t("cancel")}
        confirmText={t("blockUser")}
        onBackPressedCb={handleMorePostSettingsPressed}
      />
    ),
    [colors.text, handleBlockUser, handleMorePostSettingsPressed, name, t]
  );

  const showBlockUserBottomSheet = useCallback(() => {
    dispatch(
      showBottomSheet({
        Content: renderBlockUserContent,
        props: {
          flatListProps: null,
          useDynamicSnapPoints: true
        }
      })
    );
  }, [dispatch, renderBlockUserContent]);

  const renderDeletePostConfirmationContent = useCallback(
    () => (
      <ConfirmContent
        title={t("delete_post_description")}
        description={t("delete_post_confirm", {
          interpolation: { escapeValue: false },
          user: name
        })}
        icon={
          <Icon
            type={IconTypes.FONTAWESOME}
            disabled
            name={"trash-o"}
            color={colors.text}
            size={scale(40)}
          />
        }
        hasLoading={true}
        onPress={handleDeletePost}
        cancelText={t("cancel")}
        confirmText={t("deletePost")}
        onBackPressedCb={handleMorePostSettingsPressed}
      />
    ),
    [colors.text, handleDeletePost, handleMorePostSettingsPressed, name, t]
  );

  const showDeletePostBottomSheet = useCallback(() => {
    dispatch(
      showBottomSheet({
        Content: renderDeletePostConfirmationContent,
        props: {
          flatListProps: null,
          useDynamicSnapPoints: true
        }
      })
    );
  }, [dispatch, renderDeletePostConfirmationContent]);

  const handleEditPost = useCallback(async () => {
    modalizeRef.current?.close();

    const postCountries = [...tags]
      .map(item => {
        if (item.type === DestinationsType.COUNTRY) {
          const { slug, pkey, title } = item;
          return {
            pkey,
            title,
            slug,
            type: DestinationsType.COUNTRY,
            isTemp: true
          };
        }
        return {
          pkey: item.country.id,
          title: {
            ar: item.country.name,
            en: item.country.name,
            fr: item.country.name
          },
          slug: item.country.slug,
          type: DestinationsType.COUNTRY,
          isTemp: true
        };
      })
      .filter((tag, index, array) => array.findIndex(k => k.pkey === tag.pkey) === index);

    const editPostData = {
      postLocation: place,
      postDetails: text,
      postImages:
        gallery?.map(item => {
          return {
            uri:
              item.type === "video"
                ? `${Config.VIDEOS_MEDIA_PREFIX}/${item.id}/${item.id}${item.format}`
                : `${Config.SOCIAL_MEDIA_PREFIX}/${item.id}_md.jpg`,
            uuid: item.id,
            width: item.type === "video" ? item.widthInPx : item.width,
            height: item.type === "video" ? item.heightInPx : item.height,
            type: item.type,
            thumbnail: item.thumbnail
              ? `${Config.VIDEOS_MEDIA_PREFIX}/${item.id}/${item.id}.${item.thumbnail}`
              : "",
            format: item.format ?? "",
            alreadyUploaded: true
          };
        }) ?? [],
      postImagesUploadIds: [],
      postCountryRegionCity: null,
      postCountryRegionCitySearch: "",
      postPropertySearch: "",
      postProperties: tags,
      postCountryRegionCityArr: postCountries,
      isEditPost: true,
      postPkey: pkey,
      postTimestamp: timestamp
    };

    InteractionManager.runAfterInteractions(async () => {
      dispatch(editPost(editPostData));
      await logEvent(INITIATE_EDIT_MY_POST, {
        source: ANALYTICS_SOURCE,
        pkey,
        timestamp
      });
      navigation.navigate("AddPost");
    });
  }, [dispatch, gallery, navigation, pkey, place, tags, text, timestamp]);

  const bottomSheetContent: Element = useCallback(() => {
    if (Platform.OS === "android") {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }

    return (
      <View layout={LayoutAnimation.easeInEaseOut()} style={bottomSpacing}>
        {isMyPost ? (
          <>
            <ReportPostButton
              onPress={handleEditPost}
              title={t("editPost")}
              description={t("edit_post_description")}
              icon={
                <Icon
                  type={IconTypes.FEATHER}
                  disabled
                  name={"edit"}
                  color={colors.text}
                  size={scale(24)}
                />
              }
            />
            <ReportPostButton
              title={t("deletePost")}
              onPress={showDeletePostBottomSheet}
              description={t("delete_post_description")}
              icon={
                <Icon
                  type={IconTypes.FONTAWESOME}
                  disabled
                  name={"trash-o"}
                  color={colors.text}
                  size={scale(25)}
                />
              }
            />
          </>
        ) : (
          <>
            <ReportPostButton
              onPress={showReportBottomSheet}
              title={t("reportPost")}
              description={t("report_post_description")}
              icon={
                <Icon
                  type={IconTypes.FEATHER}
                  disabled
                  name={"alert-octagon"}
                  color={colors.text}
                  size={scale(24)}
                />
              }
            />
            <ReportPostButton
              title={t("blockUser")}
              onPress={showBlockUserBottomSheet}
              description={t("block_user_description")}
              icon={
                <Icon
                  type={IconTypes.MATERIAL_COMMUNITY_ICONS}
                  disabled
                  name={"block-helper"}
                  color={colors.text}
                  size={scale(20)}
                />
              }
            />
          </>
        )}
      </View>
    );
  }, [
    bottomSpacing,
    colors.text,
    isMyPost,
    showBlockUserBottomSheet,
    showDeletePostBottomSheet,
    showReportBottomSheet,
    handleEditPost,
    t
  ]);

  const handleGoToPostDetails = useCallback(async () => {
    await logEvent(NAVIGATE_TO_POST_DETAILS, {
      source: ANALYTICS_SOURCE,
      post_pkey: pkey,
      comments_counter: postSelector?.comments_counter,
      timestamp: timestamp,
      type: "post_header_tag"
    });
    navigation.navigate("PostDetails", {
      postPkey: pkey,
      commentsCounter: postSelector?.comments_counter,
      timestamp: timestamp
    });
  }, [navigation, pkey, postSelector?.comments_counter, timestamp]);

  const isRahhal = roles.length > 0;

  return (
    <View style={container}>
      <View style={userDetailsContainerStyle}>
        <UserProfileAvatar
          isRahhal={isRahhal}
          name={name}
          profile={profile_image}
          id={uuid}
          analyticsSource={"post_header"}
        />
        <View style={userDetailsStyle}>
          <TouchableOpacity onPress={handleGoToProfile}>
            <View style={nameWrapperStyle}>
              {verified && (
                <Icon
                  type={IconTypes.SAFARWAY_ICONS}
                  name="verified_user_filled"
                  height={scale(15)}
                  width={scale(15)}
                  style={verifiecIconStyle}
                />
              )}
              <CText fontSize={13} lineHeight={17} color={"primary_blue_d"}>
                {name}
              </CText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleGoToPostDetails}>
            <View style={hoursRowStyle}>
              <CText
                fontSize={11}
                lineHeight={15}
                style={userDetailsTextStyle}
                onPress={handleGoToPostDetails}
              >
                {moment(timestamp).fromNow()}
              </CText>
            </View>
            {!!place && place?.address && (
              <View style={row}>
                <Icon
                  type={IconTypes.MATERIAL_COMMUNITY_ICONS}
                  name={"map-marker-outline"}
                  size={moderateScale(16)}
                  color={colors.gray}
                />
                <CText fontSize={11} lineHeight={15} style={userDetailsTextStyle}>
                  {place?.address}
                </CText>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={actionsContainerStyle}>
        {!isMyPost && (
          <TouchableOpacity onPress={handleFollowPressed}>
            {isFollow ? (
              <Icon
                disabled
                type={IconTypes.SAFARWAY_ICONS}
                name={"following_user"}
                width={moderateScale(22)}
                height={moderateScale(22)}
                color={colors.primary}
              />
            ) : (
              <View style={followIconContainerStyle}>
                <Icon
                  style={followIconStyle}
                  type={IconTypes.SAFARWAY_ICONS}
                  name={"follow_user"}
                  width={moderateScale(16)}
                  height={moderateScale(16)}
                  color={colors.white}
                />
                <CText color={"white"} fontSize={13} lineHeight={17}>
                  {t("follow")}
                </CText>
              </View>
            )}
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleMorePostSettingsPressed}>
          <Icon
            type={IconTypes.FEATHER}
            name={"more-vertical"}
            size={moderateScale(22)}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default memo(PostHeader, isEqual);
