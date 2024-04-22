import { Platform } from "react-native";

import { AxiosResponse } from "axios";

import axiosInstance from "../../apiServices/axiosService";

import { getUsersListResponse, updateUserLocationProps } from "./user.types";
import APIConstants from "./userEndpoint";

import { Country } from "~/apiServices/country/country.types";
import {
  FollowerResponse,
  User,
  UserPreferences,
  UserSettings
} from "~/apiServices/user/user.types";
import { Asset } from "react-native-image-picker";
import Config from "react-native-config";

const getUserInfo = (): Promise<AxiosResponse> => {
  return axiosInstance.get(`${APIConstants.USER_INFO}`);
};

const getReferralCount = (): Promise<AxiosResponse> => {
  return axiosInstance.get(`${APIConstants.REFERRAL_CODE}`);
};

const getMyProfile = async (): Promise<AxiosResponse<User>> => {
  return axiosInstance.get(`${APIConstants.MY_PROFILE}?source=app`);
};

const getFollowers = async (
  uuid: string,
  from = 0,
  to = 10,
  following = false
): Promise<AxiosResponse<FollowerResponse[]>> => {
  return axiosInstance.get(
    `${following ? APIConstants.FOLLOWING : APIConstants.FOLLOWERS}`,
    {
      params: { uuid, from, to, source: "app" }
    }
  );
};

const getUserProfile = async (uuid: string): Promise<AxiosResponse<User>> => {
  return axiosInstance.get(`${APIConstants.USER}`, {
    params: { uuid, source: "app" }
  });
};

const updateMyProfile = async (
  gender: string,
  birth_date: string,
  given_name: string,
  family_name: string,
  country: Country,
  phone: string,
  bio: string,
  imageId: string
) => {
  return axiosInstance.post(`${APIConstants.USER}`, {
    gender,
    birth_date,
    given_name,
    family_name,
    country,
    phone,
    bio,
    images: { avatar_s3: imageId }
  });
};

const followUser = (followedUser: string) => {
  return axiosInstance.post(`${APIConstants.FOLLOW}`, {
    followedUser
  });
};

const unFollowUser = (unfollowedUser: string) => {
  return axiosInstance.post(`${APIConstants.UNFOLLOW}`, {
    unfollowedUser
  });
};

const updateUserLocation = async (data: updateUserLocationProps) => {
  return axiosInstance.post(`${APIConstants.userLocation}`, data);
};

const updateLocationSettings = async (mode: string) => {
  return axiosInstance.put(`${APIConstants.locationSettings}`, {
    location_settings: {
      mode
    }
  });
};

export const getUsersListAPI = async (data: {
  users: string[];
}): Promise<getUsersListResponse> => {
  const response = await axiosInstance.post(APIConstants.getUsers, data);

  return response.data;
};

const getUsersAroundMe = async (location: string): Promise<any> => {
  const response = await axiosInstance.get(
    `${APIConstants.usersAroundMe}?location=${location}`
  );

  return response.data;
};

const getUserReviews = async (uuid: string, nextReviewIndex = 0): Promise<any> => {
  const response = await axiosInstance.get(`${APIConstants.REVIEWS(uuid)}`, {
    params: {
      nextReviewIndex
    }
  });

  return response.data;
};

const addReferral = async (uuid: string) => {
  const response = await axiosInstance.post(APIConstants.REFERRAL, {
    owner_uuid: uuid
  });

  return response.data;
};

const updateUserPrivacySettings: ({
  _receive_email_notifications,
  _show_on_follow_recommendation,
  _show_on_users_search,
  _subscribe_to_newsletter,
  _autoplay_video,
  _upload_hd,
  _enable_sounds,
  _enable_chat_sounds
}: UserPreferences & UserSettings) => Promise<any> = async ({
  receive_email_notifications,
  show_on_follow_recommendation,
  show_on_users_search,
  subscribe_to_newsletter,
  autoplay_video,
  upload_hd,
  enable_sounds,
  enable_chat_sounds
}) => {
  return axiosInstance.post(`${APIConstants.USER}`, {
    settings: {
      receive_email_notifications: String(receive_email_notifications),
      show_on_follow_recommendation: String(show_on_follow_recommendation),
      show_on_users_search: String(show_on_users_search),
      subscribe_to_newsletter: String(subscribe_to_newsletter)
    },
    preferences: {
      autoplay_video: autoplay_video,
      upload_hd: upload_hd,
      enable_sounds: enable_sounds,
      enable_chat_sounds: enable_chat_sounds
    }
  });
};

const registerDeviceToken = async (
  deviceToken: string,
  deviceName: string,
  carrier: string,
  device: string,
  deviceId: string,
  country: string,
  appVersion: string
) => {
  return axiosInstance.post(`${APIConstants.REGISTER_DEVICE_TOKEN}`, {
    token: deviceToken,
    channel: Platform.select({
      ios: "APN",
      default: "GCM"
    }),
    device_username: deviceName,
    country: country,
    app_version: appVersion,
    network_operator: carrier,
    device_name: device,
    device_id: deviceId
  });
};

const unRegisterDeviceToken = async (deviceToken: string) => {
  return axiosInstance.delete(`${APIConstants.REGISTER_DEVICE_TOKEN}`, {
    params: {
      token: deviceToken
    }
  });
};

const getNotificationSettings = async (deviceToken: string) => {
  return axiosInstance.get(APIConstants.DEVICE_SETTINGS, {
    params: {
      token: deviceToken
    }
  });
};

const updateNotificationSettings = async (deviceToken: string, notify: boolean) => {
  return axiosInstance.put(
    APIConstants.DEVICE_SETTINGS,
    {
      notify
    },
    {
      params: {
        token: deviceToken
      }
    }
  );
};

const getNotificationCount = (): Promise<AxiosResponse> => {
  return axiosInstance.get(`${APIConstants.NOTIFICATIONS_COUNT}`);
};

const uploadPhoto = async (photo: Asset) => {
  const data = new FormData();
  data.append("file", {
    name: photo.fileName,
    type: photo.type,
    uri: Platform.OS === "android" ? photo?.uri : photo?.uri.replace("file://", "")
  });

  return axiosInstance.post(`${APIConstants.UPLOAD}`, data, {
    // axios converts form data automatically to string, so you need to use transformRequest config on request to override it.s
    headers: {
      Accept: "application/json",
      "Content-Type": `multipart/form-data`
    }
  });
};

export default {
  getMyProfile,
  getFollowers,
  updateMyProfile,
  followUser,
  unFollowUser,
  getUserProfile,
  getUserInfo,
  getReferralCount,
  getUserReviews,
  getUsersListAPI,
  addReferral,
  updateUserPrivacySettings,
  updateUserLocation,
  updateLocationSettings,
  getUsersAroundMe,
  registerDeviceToken,
  unRegisterDeviceToken,
  getNotificationCount,
  getNotificationSettings,
  updateNotificationSettings,
  uploadPhoto
};
