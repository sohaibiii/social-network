import React, { FC, useCallback, useEffect, useState } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";

import moment from "moment";
import Markdown from "react-native-markdown-display";
import { Avatar, useTheme, ActivityIndicator } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

import inboxService from "~/apiServices/inbox";
import { InboxItemTypes } from "~/apiServices/inbox/inbox.types";
import { default as markdownStyles } from "~/components/articles/articleMarkdown/ArticleMarkdown.styles";
import { BackArrow, CText, Icon, IconTypes, showAlert } from "~/components/common";
import { UserProfileImage } from "~/components/profile";
import { isRTL } from "~/constants/";
import { InboxTypes } from "~/containers/inbox/Inbox.types";
import style from "~/containers/inboxDetails/InboxDetails.styles";
import {
  updateSeenStatus,
  deleteInboxItem,
  insertInboxItem
} from "~/redux/reducers/inbox.reducer";
import {
  INBOX_ITEM_DELETE,
  INBOX_ITEM_DELETE_FAILED,
  INBOX_ITEM_DELETE_SUCCESS,
  INBOX_ITEM_UPDATE,
  INBOX_ITEM_UPDATE_FAILED,
  INBOX_ITEM_UPDATE_SUCCESS,
  logEvent
} from "~/services/";
import { translate } from "~/translations/";
import { logError, moderateScale } from "~/utils/";

const ANALYTICS_SOURCE = "inbox_details_page";

const InboxDetails: FC = props => {
  const { route, navigation } = props;
  const { item, fromNotification = false } = route?.params;
  const insets = useSafeAreaInsets();

  const theme = useTheme();
  const { colors } = theme;
  const dispatch = useDispatch();
  const [inboxDetails, setInboxDetails] = useState<InboxItemTypes>(item);

  const {
    id,
    sender,
    title = "",
    type = InboxTypes.BUSINESS,
    time = [moment()],
    description = "",
    wasSeen = false
  } = inboxDetails;

  const {
    containerStyle,
    headerStyle,
    backButtonStyle,
    actionsStyle,
    deleteButtonStyle,
    scrollViewStyle,
    contentContainerStyle,
    titleContainerStyle,
    spacingStyle,
    typeContainerStyle,
    typeTextStyle,
    senderContainerStyle,
    lineHeight,
    senderTextStyle,
    senderSpacing,
    descriptionStyle,
    loaderWrapperStyle
  } = style(colors, insets);

  const {
    bodyStyle,
    strongStyle,
    heading1Style,
    heading2Style,
    heading3Style,
    heading4Style,
    heading5Style,
    heading6Style,
    linkStyle,
    inboxImageStyle,
    imageWrapperStyle
  } = markdownStyles(theme);

  const [isSeen, setIsSeen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    inboxService
      .getInboxById(id)
      .then(data => {
        setInboxDetails(data);
        return data;
      })
      .then(data => {
        if (wasSeen) {
          return;
        }
        if (fromNotification) {
          dispatch(insertInboxItem(data));
        }

        inboxService.updateSeenStatus([id], true);
        dispatch(
          updateSeenStatus({
            id,
            wasSeen: true
          })
        );
      })
      .catch(err => {
        logError(`Error: getInboxById --inboxDetails.tsx-- ${err}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [dispatch, id]);

  const handleUpdateSeenStatus = useCallback(async () => {
    const analyticsProps = {
      source: ANALYTICS_SOURCE,
      id,
      new_seen_status: !isSeen,
      type,
      title
    };
    await logEvent(INBOX_ITEM_UPDATE, analyticsProps);

    inboxService
      .updateSeenStatus([id], !isSeen)
      .then(async () => {
        await logEvent(INBOX_ITEM_UPDATE_SUCCESS, analyticsProps);
        dispatch(
          updateSeenStatus({
            id,
            wasSeen: !isSeen
          })
        );
      })
      .catch(async error => {
        await logEvent(INBOX_ITEM_UPDATE_FAILED, analyticsProps);
        logError(`Error: updateSeenStatus --InboxDetails.tsx-- id=${id} ${error}`);
      });
    setIsSeen(prevState => !prevState);
  }, [dispatch, id, isSeen]);

  const showDeleteDialog = () => {
    showAlert(translate("delete"), translate("inbox.delete_inbox"), [
      {
        text: translate("cancel"),
        style: "cancel"
      },
      {
        text: translate("confirm"),
        onPress: () => {
          handleDeleteInbox();
        }
      }
    ]);
  };
  const handleDeleteInbox = useCallback(async () => {
    const analyticsProps = {
      source: ANALYTICS_SOURCE,
      id,
      new_seen_status: !isSeen,
      type,
      title
    };
    await logEvent(INBOX_ITEM_DELETE, analyticsProps);

    inboxService
      .deleteInboxItems([id])
      .then(async () => {
        await logEvent(INBOX_ITEM_DELETE_SUCCESS, analyticsProps);
        dispatch(deleteInboxItem({ id, wasSeen: isSeen }));
      })
      .catch(async error => {
        await logEvent(INBOX_ITEM_DELETE_FAILED, analyticsProps);
        logError(`Error: deleteInboxItems --InboxDetails.tsx id=${id} ${error}`);
      });
    navigation.goBack();
  }, [dispatch, id, isSeen, navigation]);

  const firstNameCharacters = inboxDetails?.sender?.name
    ?.split(" ")
    .map(word => word.charAt(0))
    .join("")
    .substr(0, 2);

  const senderProfileUri = { uri: sender?.profile };

  const startingTextFixer = isRTL ? <CText>&rlm;</CText> : <CText>&lrm;</CText>;

  const markdownStyle = {
    body: bodyStyle,
    strong: strongStyle,
    heading1: heading1Style,
    heading2: heading2Style,
    heading3: heading3Style,
    heading4: heading4Style,
    heading5: heading5Style,
    heading6: heading6Style,
    link: linkStyle,
    image: inboxImageStyle,
    imageWrapperStyle: imageWrapperStyle
  };

  return (
    <View style={containerStyle}>
      <View style={headerStyle}>
        <BackArrow style={backButtonStyle} />
        <View style={actionsStyle}>
          <TouchableOpacity onPress={handleUpdateSeenStatus} disabled={isLoading}>
            <Icon
              name={isSeen ? "email-outline" : "email-open-outline"}
              color={colors.text}
              type={IconTypes.MATERIAL_COMMUNITY_ICONS}
              size={25}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={showDeleteDialog}
            style={deleteButtonStyle}
            disabled={isLoading}
          >
            <Icon
              name={"trash-can-outline"}
              color={colors.text}
              type={IconTypes.MATERIAL_COMMUNITY_ICONS}
              size={25}
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={scrollViewStyle} contentContainerStyle={contentContainerStyle}>
        <View>
          <View style={titleContainerStyle}>
            <CText style={senderContainerStyle}>
              {startingTextFixer}
              <CText fontSize={18} style={lineHeight} fontFamily={"medium"}>
                {title}
              </CText>
              <View style={spacingStyle} />
              <View style={typeContainerStyle}>
                <CText fontSize={13} style={typeTextStyle}>
                  {type}
                </CText>
              </View>
            </CText>
            <View style={senderContainerStyle}>
              {sender?.profile ? (
                <UserProfileImage
                  source={senderProfileUri}
                  borderRadius={20}
                  shouldRenderProgressive={false}
                  height={moderateScale(40)}
                  width={moderateScale(40)}
                />
              ) : (
                <Avatar.Text size={moderateScale(40)} label={firstNameCharacters} />
              )}
              <View style={senderContainerStyle}>
                <CText fontSize={16} style={senderTextStyle}>
                  {sender?.name}
                </CText>
                <View style={senderSpacing} />
                <CText fontSize={13} fontFamily={"light"}>
                  {moment(time[0]).fromNow()}
                </CText>
              </View>
            </View>
          </View>
          {isLoading ? (
            <View style={loaderWrapperStyle}>
              <ActivityIndicator />
            </View>
          ) : (
            <View style={descriptionStyle}>
              <Markdown style={markdownStyle}>{description}</Markdown>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default InboxDetails;
