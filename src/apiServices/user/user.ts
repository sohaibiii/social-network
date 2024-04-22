import Auth from "@aws-amplify/auth";
import { AxiosResponse } from "axios";

import { NotificationsCountResponse, ReferralCount } from "./user.types";

import { userAPI } from "~/apis/";
import { updateUserLocationProps } from "~/apis/user/user.types";
import { Country } from "~/apiServices/country/country.types";
import { Follower, FollowerResponse, User } from "~/apiServices/user/user.types";
import { SimpleUser } from "~/types/user";
import { logError } from "~/utils/";
import { Asset } from "react-native-image-picker";

const getReferralCount: () => Promise<ReferralCount> = async () => {
  try {
    const { data } = await userAPI.getReferralCount();
    const { ProcessInfo, ...restOfProps } = data;
    return restOfProps;
  } catch (error) {
    logError(`Error: getReferralCount --user.ts-- ${error}`);
  }
};

const getMyProfile: () => Promise<AxiosResponse<User> | undefined> = async () => {
  try {
    return await userAPI.getMyProfile();
  } catch (error) {
    logError(`Error: getMyProfile --user.ts-- ${error}`);
  }
};

const updateMyProfile: (
  _gender: string,
  _birth_date: string,
  _given_name: string,
  _family_name: string,
  _country: Country,
  _phone: string,
  _bio: string,
  _imageId?: string
) => Promise<AxiosResponse | undefined> = async (
  gender: string,
  birth_date: string,
  given_name: string,
  family_name: string,
  country: Country,
  phone: string,
  bio: string,
  imageId: string
) => {
  try {
    return await userAPI.updateMyProfile(
      gender,
      birth_date,
      given_name,
      family_name,
      country,
      phone,
      bio,
      imageId
    );
  } catch (error) {
    logError(
      `Error: updateMyProfile --user.ts-- given_name=${given_name} family_name=${family_name} ${error}`
    );
  }
};

const addReferral: (_uuid: string) => Promise<AxiosResponse | undefined> = async uuid => {
  try {
    return await userAPI.addReferral(uuid);
  } catch (error) {
    logError(`Error: addReferral --user.ts-- uuid=${uuid} ${error}`);
    throw error;
  }
};

const followUser: (
  _followedUser: string,
  _shouldFollow: boolean
) => Promise<AxiosResponse | undefined> = async (followedUser, shouldFollow) => {
  try {
    if (shouldFollow) return await userAPI.followUser(followedUser);
    return await userAPI.unFollowUser(followedUser);
  } catch (error) {
    logError(`Error: followUser --user.ts-- _followedUser=${followedUser} ${error}`);
    throw error;
  }
};

const getUserReviews: (
  _uuid: string,
  _nextReviewIndex?: number
) => Promise<AxiosResponse | undefined> = async (uuid: string, nextReviewIndex = 0) => {
  try {
    return await userAPI.getUserReviews(uuid, nextReviewIndex);
  } catch (error) {
    logError(`Error: getUserReviews --user.ts-- uuid=${uuid} ${error}`);
    throw error;
  }
};

const getFollowers: (
  _uuid: string,
  _from: number,
  _to: number,
  _following: boolean
) => Promise<Follower[] | undefined> = async (uuid, from, to, following) => {
  const { data } = await userAPI.getFollowers(uuid, from, to, following);
  if (!data || (!!data && Object.keys(data).length === 0)) {
    return [];
  }
  const nameOfResponse = following ? "following" : "followers";
  try {
    const users: Follower[] = data[nameOfResponse]?.map((user: FollowerResponse) => {
      return {
        name: user.name,
        uuid: user.uuid,
        profileImage: user.profile_image ?? "",
        profile: user.profile ?? undefined,
        roles: user.roles ?? [],
        gender: user.gender ?? "male",
        country: {
          id: user.country?.id ?? "",
          name:
            (typeof user.country === "string" ? user.country : user.country?.name) ?? ""
        },
        isFollow: user.isFollow,
        verified: user.verified ?? false
      };
    });
    return users;
  } catch (error) {
    logError(
      `Error: getFollowers --user.ts-- uuid=${uuid} from=${from} to=${to} ${error}`
    );
  }
};

const register: (
  _firstName: string,
  _lastName: string,
  _email: string,
  _password: string
) => Promise<string | undefined> = async (firstName, lastName, email, password) => {
  try {
    const emailLowercase = email.toLowerCase();

    await Auth.signUp({
      username: emailLowercase,
      password,
      attributes: {
        email: emailLowercase,
        given_name: firstName,
        family_name: lastName
      }
    });
    return;
  } catch (error) {
    logError(
      `Error: register --user.ts-- firstName=${firstName} lastName=${lastName} email=${email}  ${error}`
    );
    return Promise.reject(error);
  }
};

const forgotPassword: (_email: string) => Promise<string | undefined> = async email => {
  try {
    await Auth.forgotPassword(email.toLowerCase());
    return;
  } catch (error) {
    logError(`Error: forgotPassword --user.ts-- email=${email} ${error}`);
    return Promise.reject(error.code);
  }
};
const resetPasswordWithOTP: (
  _username: string,
  _code: string,
  _password: string
) => Promise<string | undefined> = async (username, code, password) => {
  try {
    await Auth.forgotPasswordSubmit(username.toLowerCase(), code, password);
    return;
  } catch (error) {
    logError(`Error: resetPasswordWithOTP --user.ts-- username=${username} ${error}`);
    return Promise.reject(error);
  }
};

const getUserProfile: (_uuid: string) => Promise<AxiosResponse<User>> = async uuid => {
  return await userAPI.getUserProfile(uuid);
};

const updateUserLocation: (_data: updateUserLocationProps) => any = async data => {
  return await userAPI.updateUserLocation(data);
};

const updateLocationSettings: (_mode: string) => any = async mode => {
  return await userAPI.updateLocationSettings(mode);
};

const getUsersAroundMe: (_location: string) => Promise<SimpleUser[]> = async location => {
  const data = await userAPI.getUsersAroundMe(location);
  const users: SimpleUser[] =
    data.result
      .filter((item: any) => item.pkey === "on")?.[0]
      ?.items?.filter((user: any) => user?.pkey && user?.name)
      .map((user: any) => ({
        name: user.name,
        uuid: user.pkey,
        profileImage: user.featured_image?.image_uuid ?? "",
        roles: user.roles ?? [],
        gender: user.gender ?? "male",
        country: {
          id: user.country?.id ?? "",
          name:
            (typeof user.country === "string" ? user.country : user.country?.name) ?? ""
        },
        isFollow: user.isFollow,
        verified: user.verified ?? false
      })) || [];

  return users;
};

const registerDeviceToken: (
  _deviceToken: string,
  _deviceName: string,
  _carrier: string,
  _device: string,
  _deviceId: string,
  _country: string,
  _appVersion: string
) => any = async (
  deviceToken,
  deviceName,
  carrier,
  device,
  deviceId,
  country,
  appVersion
) => {
  return await userAPI.registerDeviceToken(
    deviceToken,
    deviceName,
    carrier,
    device,
    deviceId,
    country,
    appVersion
  );
};

const unRegisterDeviceToken: (_deviceToken: string) => any = async deviceToken => {
  return await userAPI.unRegisterDeviceToken(deviceToken);
};

const getNotificationCount: () => Promise<NotificationsCountResponse> = async () => {
  try {
    const { data }: { data: { new: number; totalUnreadInboxCount: number } } =
      await userAPI.getNotificationCount();

    return {
      notificationsCount: data?.new || 0,
      inboxCount: data?.totalUnreadInboxCount || 0
    };
  } catch (error) {
    logError(`Error: getNotificationCount --user.ts-- ${error}`);
  }
};

const getNotificationSettings: (
  _deviceToken: string
) => Promise<AxiosResponse<User> | undefined> = async (deviceToken: string) => {
  try {
    const { data } = await userAPI.getNotificationSettings(deviceToken);

    return data;
  } catch (error) {
    logError(
      `Error: getNotificationSettings --user.ts-- deviceToken=${deviceToken} ${error}`
    );
  }
};

const updateNotificationSettings: (
  _deviceToken: string,
  _notify: boolean
) => Promise<AxiosResponse<User> | undefined> = async (
  deviceToken: string,
  notify: boolean
) => {
  try {
    const { data } = await userAPI.updateNotificationSettings(deviceToken, notify);

    return data.new;
  } catch (error) {
    logError(
      `Error: updateNotificationSettings --user.ts-- deviceToken=${deviceToken} notify=${notify} ${error}`
    );
  }
};

const uploadPhoto: (_photo: Asset) => Promise<AxiosResponse | undefined> = async (
  photo: Asset
) => {
  try {
    const { data } = await userAPI.uploadPhoto(photo);
    return data;
  } catch (error) {
    logError(`Error: uploadPhoto --user.ts-- url=${photo?.uri} ${error}`);
  }
};

export default {
  getMyProfile,
  register,
  resetPasswordWithOTP,
  forgotPassword,
  updateMyProfile,
  getUserReviews,
  addReferral,
  getFollowers,
  followUser,
  getUserProfile,
  getReferralCount,
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
