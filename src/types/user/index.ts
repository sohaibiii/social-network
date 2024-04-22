import { NameUUID } from "~/types/common";

interface UserPreferences {
  videoAutoPlay: boolean;
  uploadHD: boolean;
  enableSounds: boolean;
  enableChatSounds: boolean;
}

export interface SimpleUser extends NameUUID {
  gender?: "male" | "female";
  profileImage?: string;
  profile?: string;
  roles?: string[];
  verified?: boolean;
  preferences?: UserPreferences;
  isCompleted?: boolean;
  acceptedChatTerms?: boolean;
  country?: {
    id: string;
    name: string;
  };
  isFollow?: boolean;
  locationSettings?: {
    mode: string;
    timeTillNextUpdate: number;
  };
  referredBy?: string;
}

export interface UserProfile extends SimpleUser {
  givenName: string;
  familyName: string;
  address: string;
  bio: string;
  phone: string;
  website: string;
  birthDate: string;
}

interface UserSettings {
  showInRecommendations: boolean;
  showInSearchResults: boolean;
  receiveEmailNotifications: boolean;
  subscribeToNewsLetter: boolean;
}

export interface User extends UserProfile {
  followers: SimpleUser[];
  following: SimpleUser[];
  followingCount: number;
  followersCount: number;
  email: string;
  social: boolean;
  rahhalStatus: string;
  verifiedStatus: string;
  settings?: UserSettings;
  chatSettings?: {
    allowReceiveInvitations: boolean;
  };
}

export interface Influencer extends SimpleUser {
  address: string;
  followers: number;
}

export interface Notification extends SimpleUser {
  uuid: string;
  profileImage: string;
  pkey: string;
  timestamp: number;
  slug: string;
  type: string;
}
