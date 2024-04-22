import React, { useState, useEffect } from "react";
import { SafeAreaView, View } from "react-native";

import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { Text, useTheme } from "react-native-paper";
import { useSelector } from "react-redux";

import styles from "./InviteFriend.style";

import { RootState } from "~/redux/store";

import userService from "~/apiServices/user";
import { ReferralCount } from "~/apiServices/user/user.types";
import { Icon, IconTypes } from "~/components/";
import { Button } from "~/components/common";
import { APP_SCREEN_WIDTH } from "~/constants/";
import {
  logEvent,
  INVITE_A_FRIEND_PAGE_VISITED,
  INVITE_A_FRIEND_INITIATE,
  INVITE_A_FRIEND_SUCCESS,
  INVITE_A_FRIEND_FAILED
} from "~/services/analytics";
import {
  DynamicLinksAction,
  handleCreateShareLink,
  showShareView
} from "~/services/rnFirebase/dynamicLinks";
import { logError, generalErrorHandler } from "~/utils/";

const InviteFriend = (): JSX.Element => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { userInfo: { id: uuid = "", name = "" } = {} } =
    useSelector((state: RootState) => state.auth) || {};

  const [numberOfUsers, setNumberOfUsers] = useState<number>(0);
  const [isLoadingShare, setIsLoadingShare] = useState<boolean>(false);

  useEffect(() => {
    userService
      .getReferralCount()
      .then(({ referrals_count }: ReferralCount) => {
        setNumberOfUsers(referrals_count);
        logEvent(INVITE_A_FRIEND_PAGE_VISITED, { source: "invite_a_friend_page" });
      })
      .catch((error: AxiosError) => {
        logError(`getReferralCount error ${error}`);
      });
  }, []);

  const handleInviteAFriend = async () => {
    setIsLoadingShare(true);

    const message = `${t(`referral_link_description_text`, {
      name
    })}`;
    await logEvent(INVITE_A_FRIEND_INITIATE, {
      source: "invite_a_friend_page",
      action: DynamicLinksAction.REFERRAL,
      title: name,
      description: message,
      params: {
        userId: uuid
      }
    });
    handleCreateShareLink({
      action: DynamicLinksAction.REFERRAL,
      title: name,
      description: message,
      params: {
        userId: uuid
      }
    })
      .then(link => {
        return showShareView(link);
      })
      .then(async shareRes => {
        await logEvent(INVITE_A_FRIEND_SUCCESS, {
          source: "invite_a_friend_page",
          action: DynamicLinksAction.REFERRAL,
          title: name,
          description: message,
          params: {
            userId: uuid
          },
          ...shareRes
        });
      })
      .catch(async error => {
        generalErrorHandler(
          `Error: handleCreateShareLink --InviteFriend.tsx userId=${uuid} ${error}`
        );
        await logEvent(INVITE_A_FRIEND_FAILED, {
          source: "invite_a_friend_page",
          action: DynamicLinksAction.REFERRAL,
          title: name,
          description: message,
          params: {
            userId: uuid
          }
        });
      })
      .finally(() => {
        setIsLoadingShare(false);
      });
  };
  const {
    container,
    shareButtonStyle,
    primaryTextStyle,
    shareButtonTextStyle,
    row,
    paragraphStyle
  } = styles(theme);

  return (
    <SafeAreaView style={container}>
      <View style={row}>
        <Text style={paragraphStyle}>{t("number_of_friends_invited")}</Text>
        <Text style={primaryTextStyle}>{numberOfUsers}</Text>
      </View>
      <View style={row}>
        <Icon
          name={"referral"}
          type={IconTypes.SAFARWAY_ICONS}
          width={APP_SCREEN_WIDTH}
          height={APP_SCREEN_WIDTH / 2}
        />
      </View>
      <View style={row}>
        <Text style={paragraphStyle}>{t("share_with_friends")}</Text>
        <Button
          mode="contained"
          title={t("share_now")}
          labelStyle={shareButtonTextStyle}
          style={shareButtonStyle}
          onPress={handleInviteAFriend}
          isLoading={isLoadingShare}
        />
      </View>
    </SafeAreaView>
  );
};

export default InviteFriend;
