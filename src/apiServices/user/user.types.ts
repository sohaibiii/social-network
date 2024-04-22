export interface ReferralCount {
  referrals_count: number;
}

interface UserCountry {
  name: string;
}
interface AvatarImage {
  avatar_s3?: string;
}

interface Rahhal {
  pkey: string;
  ts: number;
  status: string;
}
interface VerifyAccount {
  pkey: string;
  ts: number;
  status: string;
}

export interface UserSettings {
  receive_email_notifications: string;
  show_on_follow_recommendation: string;
  show_on_users_search: string;
  subscribe_to_newsletter: string;
  next_search_update?: number;
}

export interface UserPreferences {
  autoplay_video: boolean;
  enable_chat_sounds: boolean;
  enable_sounds: boolean;
  upload_hd: boolean;
}

export interface UserSettingsUnionUserPreferences extends UserSettings, UserPreferences {}

export interface Follower {
  name: string;
  uuid: string;
  gender: "male" | "female";
  profileImage: string;
  profile: string;
  roles: string[];
  verified: boolean;
  country: {
    id: string;
    name: string;
  } & string;
  isFollow?: boolean;
}
export interface FollowerResponse {
  name: string;
  uuid: string;
  gender: "male" | "female";
  profile_image: string;
  profile: string;
  roles: string[];
  verified: boolean;
  country: {
    id: string;
    name: string;
  } & string;
  isFollow?: boolean;
}
export interface NotificationsCountResponse {
  notificationsCount: number;
  inboxCount: number;
}
export interface User {
  uuid?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  followersCount?: number;
  followingCount?: number;
  bio?: string;
  images?: AvatarImage;
  country?: UserCountry;
  isFollow?: boolean;
  phone?: string;
  birth_date?: string;
  gender?: "male" | "female";
  verified?: boolean;
  rahhal?: Rahhal;
  verify?: VerifyAccount;
  settings?: UserSettings;
  preferences?: UserPreferences;
  social?: string;
}
