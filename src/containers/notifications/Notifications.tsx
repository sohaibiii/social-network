import React, { FC, useEffect, useState } from "react";
import { View, TouchableOpacity, InteractionManager } from "react-native";

import { useNavigation } from "@react-navigation/core";
import moment from "moment";
import { Avatar, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import notificationsStyles from "./notifications.styles";
import { NotificationVariables } from "./notifications.types";

import { RootState } from "~/redux/store";

import postService from "~/apiServices/post";
import { CText, CustomFlatList, Icon, IconTypes } from "~/components/common";
import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import { UserProfileImage } from "~/components/profile";
import { loadNewPosts } from "~/redux/reducers/home.reducer";
import { setBadges } from "~/redux/reducers/notifications.reducer";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import { getNotificationsThunk } from "~/redux/thunk";
import {
  GET_NOTIFICATIONS_LIST,
  GET_NOTIFICATIONS_LIST_FAILED,
  GET_NOTIFICATION_LIST_SUCCESS,
  NOTIFICATION_LIST_PRESSED,
  logEvent
} from "~/services/";
import { translate } from "~/translations/swTranslator";
import { thunkDispatch } from "~/utils/reduxUtil";
import { scale } from "~/utils/responsivityUtil";

const Notifications: FC = () => {
  const { colors } = useTheme();
  const {
    listEmptyComponentContainer,
    rowContainer,
    badgeStyle,
    notificationContent,
    timeTextStyle,
    userContainer,
    usernameStyle,
    userVerifyStyle,
    avatarLabelStyle
  } = notificationsStyles(colors);

  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications
  );

  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    thunkDispatch(getNotificationsThunk())
      .then(() => {
        dispatch(setBadges(0));
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
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [dispatch]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case "like":
        return NotificationVariables.LIKE;
      case "NEW_REVIEW":
        return NotificationVariables.RATE;
      case "NEW_POST":
        return NotificationVariables.IMAGES_GALLERY;
      case "NEW_COMMENT":
      case "NEW_REPLY":
        return NotificationVariables.COMMENT;
      case "FOLLOW":
        return NotificationVariables.FOLLOW;
      default:
        return NotificationVariables.SHARE;
    }
  };

  const getText = (
    type: string,
    isReview: boolean,
    likeType: string,
    context: "female" | "male"
  ) => {
    switch (type) {
      case "new_post":
        return translate("added_new_post", { context });
      case "new_review":
        return translate("added_new_review", { context });
      case "new_comment":
        return translate("commented_new_post", { context });
      case "new_reply":
        if (isReview) return translate("replied_to_your_review", { context });
        return translate("replied_to_your_comment", { context });
      case "like":
        if (likeType === "reply") return translate("liked_your_reply", { context });
        if (likeType === "comment") return translate("liked_your_comment", { context });
        if (likeType === "review") return translate("liked_your_review", { context });
        return translate("liked_your_post", { context });
      case "follow":
        return translate("followed_you", { context });
      default:
        return "";
    }
  };

  const ListEmptyComponent = () => (
    <View style={listEmptyComponentContainer}>
      <CText textAlign="center" fontSize={16}>
        {translate("no_notifications_yet")}
      </CText>
    </View>
  );

  const onUserProfilePress = (uuid: string) => {
    navigation.navigate("Profile", {
      uuid,
      hasBackButton: true
    });
  };

  const handleNotificationPressed = async item => {
    setIsLoading(true);

    const post =
      ((item.action === "like" && item.type !== "review") ||
        item.action === "NEW_POST" ||
        item.action === "NEW_REPLY" ||
        item.action === "NEW_COMMENT") &&
      (await postService.getPost(item.pkey, item.PostTS));

    await logEvent(NOTIFICATION_LIST_PRESSED, {
      source: "notifications_page",
      action: item.action,
      slug: item.slug,
      uuid: item.uuid,
      pkey: item.pkey,
      timestamp: item.PostTS
    });

    switch (item.action) {
      case "NEW_REVIEW":
        return navigation.navigate("Property", { slug: item.slug });
      case "NEW_COMMENT":
      case "NEW_POST":
      case "NEW_REPLY":
        if (!post) {
          return;
        }
        dispatch(loadNewPosts([post]));

        return navigation.navigate("PostDetails", {
          postPkey: item.pkey,
          commentsCounter: post?.comments_counter,
          timestamp: item.PostTS
        });
      case "like":
        if (item.type === "review") {
          return navigation.navigate("Property", { slug: item.slug });
        }
        dispatch(loadNewPosts([post]));

        return navigation.navigate("PostDetails", {
          postPkey: item.pkey,
          commentsCounter: post?.comments_counter,
          timestamp: item.PostTS
        });
      case "FOLLOW":
        return navigation.navigate("Profile", {
          uuid: item.uuid,
          hasBackButton: true
        });
      default:
        return;
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("transitionEnd", e => {
      if (e?.data?.closing) {
        InteractionManager.runAfterInteractions(() => {
          setIsLoading(false);
        });
      }
    });
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => {
    const notificationContainer = [
      rowContainer,
      {
        backgroundColor:
          item.status === "read" ? colors.background : colors.notifications.variant1
      }
    ];
    const firstNameCharacters = item?.sud?.name
      ?.split(" ")
      .map(word => word.charAt(0))
      .join("")
      .substr(0, 2);

    return (
      <TouchableOpacity
        style={notificationContainer}
        onPress={() => handleNotificationPressed(item)}
      >
        {item.sud.profile ? (
          <UserProfileImage
            source={{ uri: item.sud.profile }}
            borderRadius={20}
            height={scale(50)}
            width={scale(50)}
            onPress={() => onUserProfilePress(item.uuid)}
          />
        ) : (
          <Avatar.Text
            size={scale(50)}
            label={firstNameCharacters}
            labelStyle={avatarLabelStyle}
          />
        )}
        <View style={badgeStyle}>
          <Icon
            width={scale(24)}
            height={scale(24)}
            name={getActionIcon(item.action)}
            type={IconTypes.SAFARWAY_ICONS}
            onPress={() => onUserProfilePress(item.uuid)}
          />
        </View>
        <View style={notificationContent}>
          <View style={userContainer}>
            <View style={usernameStyle}>
              {item.sud.verified && (
                <View style={userVerifyStyle}>
                  <Icon
                    name="verified_user"
                    width={scale(14)}
                    height={scale(14)}
                    type={IconTypes.SAFARWAY_ICONS}
                  />
                </View>
              )}
              <CText
                color="primary"
                numberOfLines={1}
                fontSize={14}
                lineHeight={scale(18)}
              >
                {item.sud.name}
              </CText>
            </View>
            <CText fontSize={13} lineHeight={scale(18)} fontFamily="light">
              {getText(
                item.action.toLowerCase(),
                !!item.slug,
                item.type?.toLowerCase() ?? "",
                item.sud.gender.toLowerCase()
              )}
            </CText>
          </View>
          <CText fontSize={11} fontFamily="light" style={timeTextStyle}>
            {moment(item.TS).fromNow()}
          </CText>
        </View>
      </TouchableOpacity>
    );
  };

  const keyExtractor = item => `${item.action}_${item.TS}_${item.PostTS || item.slug}`;

  const onRefresh = async () => {
    setIsRefreshing(true);
    await logEvent(GET_NOTIFICATIONS_LIST, { source: "notifications_page" });
    thunkDispatch(getNotificationsThunk())
      .then(async () => {
        await logEvent(GET_NOTIFICATION_LIST_SUCCESS, { source: "notifications_page" });
        dispatch(setBadges(0));
      })
      .catch(async () => {
        await logEvent(GET_NOTIFICATIONS_LIST_FAILED, { source: "notifications_page" });
        dispatch(
          showSnackbar({
            text: translate("something_went_wrong"),
            type: SnackbarVariations.TOAST,
            duration: 2000,
            backgroundColor: "red"
          })
        );
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  return (
    <CustomFlatList
      data={notifications}
      ListEmptyComponent={<ListEmptyComponent />}
      initialLoader={isLoading}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      onRefresh={onRefresh}
      refreshing={isRefreshing}
    />
  );
};

export { Notifications };
