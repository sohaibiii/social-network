import { ImageSourcePropType } from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Hotel } from "~/apiServices/hotels/hotels.types";
import { ReviewSummaryProps } from "~/components/common";
import {
  Room,
  RoomVariation
} from "~/components/hotelDetails/RoomDetailsCard/RoomDetailsCard.types";

interface Title {
  ar: string;
  en: string;
}

export type RootStackParamList = {
  HomeTabs: undefined;
  PointsBank: undefined;
  LoginByEmail: undefined;
  InviteFriend: undefined;
  VerifyAccount: undefined;
  VerifyRahhal: undefined;
  ProfileFollows: undefined;
  Profile: {
    uuid: string | undefined;
    hasBackButton: boolean;
  };
  QRScreen: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  PrivacySettings: undefined;
  ChangeLanguage: undefined;
  DeleteAccount: undefined;
  Articles: undefined;
  ArticleDetails: { title: Title; slug: string };
  BlockList: undefined;
  Notifications: undefined;
  FavoriteItems: undefined;
  NearbyUsers: undefined;
  FavoriteList: undefined;
  SurroundingLandmarks: { showMyLocation?: boolean };
  CityCountryRegion: { title: string; slug: string; type: string };
  Property: { slug: string };
  HotelsListView: {
    searchTerm: string;
    position: {
      lat: number;
      lng: number;
    };
  };
  HotelsMapView: {
    filters: string[];
    updateListViewHotels: (_hotels: Hotel[]) => void;
    hotels: Hotel[];
    position: {
      lat: number;
      lng: number;
    };
  };
  HotelDetails: {
    hotelIndex: string;
  };
  Reviews: {
    pkey: string;
    rate: ReviewSummaryProps["rate"];
  };
  HotelBooking: {
    image: ImageSourcePropType;
    variation: RoomVariation;
    room: Room;
    isPackage: boolean;
  };
  PostDetails: {
    postPkey: string;
    commentsCounter?: number;
    timestamp: number;
  };
  ReplyDetailsScreen: {
    commentIndex: number;
  };
  Hashtag: {
    hashtag: string;
  };
  Search: {
    isHashtag: boolean;
    isCategoryRecommendation: boolean;
    categoryRecommendationId: number;
    searchPlaceholder: string;
    searchTextPlaceholder?: string;
  };
  MapDirections: undefined;
  LikesList: {
    title: string;
    postPkey: string;
    timestamp: number;
  };
  MapView: undefined;
  NotFoundPage: undefined;
  SearchCityCountyRegion: {
    destinationInfo: any;
    type: string;
    slug: string;
  };
};

export type AppStackRoutesArticleDetailsProps = NativeStackScreenProps<
  RootStackParamList,
  "ArticleDetails"
>;

export type AppStackRoutesHotelsListProps = NativeStackScreenProps<
  RootStackParamList,
  "HotelsListView"
>;

export type AppStackRoutesHotelsMapProps = NativeStackScreenProps<
  RootStackParamList,
  "HotelsMapView"
>;

export type AppStackRoutesSearchProps = NativeStackScreenProps<
  RootStackParamList,
  "Search"
>;

export type AppStackRoutesHotelDetailsProps = NativeStackScreenProps<
  RootStackParamList,
  "HotelDetails"
>;

export type AppStackRoutesBookingProps = NativeStackScreenProps<
  RootStackParamList,
  "HotelBooking"
>;

export type AppStackRoutesArticlesProps = NativeStackScreenProps<
  RootStackParamList,
  "Articles"
>;

export type AppStackRoutesCityCountryRegionProps = NativeStackScreenProps<
  RootStackParamList,
  "CityCountryRegion"
>;

export type AppStackRoutesSurroundingLandmarksProps = NativeStackScreenProps<
  RootStackParamList,
  "SurroundingLandmarks"
>;

export type AppStackRoutesPropertyProps = NativeStackScreenProps<
  RootStackParamList,
  "Property"
>;

export type AppStackRoutesHashtagProps = NativeStackScreenProps<
  RootStackParamList,
  "Hashtag"
>;

export type AppStackRoutesLikesListProps = NativeStackScreenProps<
  RootStackParamList,
  "LikesList"
>;

export type SearchCityCountyRegionProps = NativeStackScreenProps<
  RootStackParamList,
  "SearchCityCountyRegion"
>;
