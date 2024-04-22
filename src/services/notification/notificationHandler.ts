import { retrieveItem } from "../asyncStorage";
import { navigate } from "../navigation";

import { NotificationTypes } from "./notificaiton.types";

import store from "~/redux/store";

import axiosInstance from "~/apiServices/axiosService";
import { JWT_TOKEN_FLAG } from "~/constants/";
import { loadNewPosts } from "~/redux/reducers/home.reducer";
import { incrementBadges } from "~/redux/reducers/inbox.reducer";
import { logEvent, PUSH_NOTIF_PRESSED } from "~/services/";
import { GenericObject } from "~/types/common";
import { errorLogFormatter, logError } from "~/utils/";

const notificationHandler = async (notification: any, isInternalCampaign = false) => {
  try {
    const { title, message, data } = notification || {};

    const {
      notificationImageUrl,
      params,
      userImageUrl,
      url,
      title: campaignTitle,
      internal = false
    } = data || {};

    const formattedParams = typeof params === "string" ? JSON.parse(params) : params;
    const { pkey, link, userId, timestamp, slug, type } = formattedParams;

    if (!isInternalCampaign) {
      await logEvent(PUSH_NOTIF_PRESSED, {
        source: "notification_handler",
        type: url,
        pkey,
        timestamp,
        link,
        user_id: userId,
        slug,
        internal,
        campaign_type: type
      });
    }

    switch (url) {
      case NotificationTypes.CAMPAIGN:
        if (typeof internal === "string" ? internal === "true" : internal) {
          return handleInternalCampaignNotification(formattedParams);
        } else {
          return handleExternalCampaignNotification(formattedParams, campaignTitle);
        }
      case NotificationTypes.POST:
        return handlePostNotification(formattedParams);
      case NotificationTypes.PROPERTY:
        return handlePropertyNotification(formattedParams);
      case NotificationTypes.PROFILE:
        return handleProfileNotification(formattedParams);
      case NotificationTypes.INBOX:
        return handleInboxNotification(formattedParams);
      default:
        break;
    }
  } catch (error) {
    logError(`notificationHandler error ${error}`);
  }
};
const notificationReceivedHandler = async (notification: any) => {
  try {
    const { data } = notification || {};

    const { url } = data || {};

    switch (url) {
      case NotificationTypes.INBOX:
        return store.dispatch(incrementBadges());
      default:
        break;
    }
  } catch (error) {
    logError(`notificationHandler error ${error}`);
  }
};

const handlePostNotification = async (params: GenericObject) => {
  try {
    const { pkey, timestamp } = params || {};
    const token = (await retrieveItem(JWT_TOKEN_FLAG)) ?? null;

    const { data: post } = await axiosInstance.get(`/post`, {
      params: {
        pkey,
        ts: timestamp
      },
      headers: {
        source: "app",
        authorization: token
      }
    });
    store.dispatch(loadNewPosts([post]));

    return navigate("PostDetails", {
      postPkey: pkey,
      commentsCounter: 0,
      timestamp: timestamp
    });
  } catch (error) {
    logError(
      `Error: handlePostNotification --notificationHandler.ts-- params=${errorLogFormatter(
        params
      )} ${error} `
    );
  }
};

const handlePropertyNotification = async (params: GenericObject) => {
  try {
    const { slug } = params || {};
    return navigate("Property", { slug });
  } catch (error) {
    logError(
      `Error: handlePropertyNotification --notificationHandler.ts-- params=${errorLogFormatter(
        params
      )} ${error} `
    );
  }
};

const handleProfileNotification = async (params: GenericObject) => {
  try {
    const { userId } = params || {};

    navigate("Profile", {
      uuid: userId,
      hasBackButton: true
    });
  } catch (error) {
    logError(
      `Error: handleProfileNotification --notificationHandler.ts-- params=${errorLogFormatter(
        params
      )} ${error} `
    );
  }
};
const handleInboxNotification = async (params: GenericObject) => {
  try {
    const { inbox_id } = params || {};

    navigate("InboxDetails", {
      item: {
        id: inbox_id,
        wasSeen: false
      },
      fromNotification: true
    });
  } catch (error) {
    logError(
      `Error: handleInboxNotification --notificationHandler.ts-- params=${errorLogFormatter(
        params
      )} ${error} `
    );
  }
};
const handleInternalCampaignNotification = async (params: GenericObject) => {
  try {
    const { type, ...restOfParams } = params || {};

    return notificationHandler(
      {
        data: {
          url: type,
          params: restOfParams
        }
      },
      true
    );
  } catch (error) {
    logError(
      `Error: handleInternalCampaignNotification --notificationHandler.ts-- params=${errorLogFormatter(
        params
      )} ${error} `
    );
  }
};
const handleExternalCampaignNotification = async (
  params: GenericObject,
  title: string
) => {
  try {
    const { link } = params || {};

    return navigate("InAppWebPageViewer", {
      link,
      title
    });
  } catch (error) {
    logError(
      `Error: handleExternalCampaignNotification --notificationHandler.ts-- params=${errorLogFormatter(
        params
      )} ${error} `
    );
  }
};

export { notificationHandler, notificationReceivedHandler };
