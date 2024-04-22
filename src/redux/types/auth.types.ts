import Geolocation from "react-native-geolocation-service";

export const SLICE_NAME = "auth";
import { User } from "~/apiServices/user/user.types";

export interface UserInfo {
  accept_chat_terms: true;
  chat_settings: {
    allow_receive_invitations: true;
  };
  email: string;
  followers: number;
  following: number;
  id: string;
  isCompleted: boolean;
  is_completed_name: boolean;
  location_settings: {
    mode: string;
  };
  name: string;
  profile: string;
  profile_image: string;
  referred_by: string;
  verified: boolean;
  country: {
    name: string;
  };
}
export interface UserProfile {
  providerName: string;
  providerType: string;
  givenName: string;
  familyName: string;
  name: string;
  email: string;
  emailVerified: boolean;
  phoneNumber: string;
  phoneNumberVerified: boolean;
}

export interface InternetServiceProviderInfo {
  ip: string;
  version: string;
  city: string;
  region: string;
  region_code: string;
  country: string;
  country_name: string;
  country_code: string;
  country_code_iso3: string;
  country_capital: string;
  country_tld: string;
  continent_code: string;
  in_eu: boolean;
  postal: string | number | null;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  currency_name: string;
  languages: string;
  country_area: number;
  country_population: number;
  asn: string;
  org: string;
}

export interface RahhalVerify {
  ts?: number;
  pkey?: string;
  status?: string;
}

interface PushNotificationToken {
  os: string;
  token: string;
}
export interface AuthInterface {
  isLoading?: boolean;
  isSignout?: boolean;
  needsVerification?: boolean;
  userToken?: string | null;
  refreshToken?: string | null;
  isUnderMaintenance?: boolean;
  isUnderForceUpgrade?: boolean;
  user?: UserProfile | undefined;
  userInfo?: UserInfo | undefined;
  location?: Geolocation.GeoCoordinates | false | undefined;
  userProfile?: User | undefined;
  isUserProfileLoading?: boolean;
  rahhal?: RahhalVerify | undefined;
  verify?: RahhalVerify | undefined;
  pushNotificationToken?: PushNotificationToken | null;
}
