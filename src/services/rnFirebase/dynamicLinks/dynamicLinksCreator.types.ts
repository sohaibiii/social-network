interface ItemProps {
  action: string;
  title?: string;
  description?: string;
  image?: any;
  location?: any;
  params: PostProps &
    PropertyProps &
    ProfileProps &
    ArticleProps &
    HotelProps &
    GeoPlaceProps;
}

interface PostProps {
  pkey?: string;
  timestamp?: number;
  ts?: number;
  website?: string;
}
interface PropertyProps {
  slug?: string;
}
interface GeoPlaceProps {
  slug?: string;
  type?: string;
}

interface ProfileProps {
  userId?: string;
}
interface ArticleProps {
  slug?: string;
  imageUUID?: string;
}
interface HotelProps {
  payload?: any;
  hotelId?: string;
}

enum DynamicLinksAction {
  POST = "post",
  POST_SPONSORSHIP = "post_sponsorship",
  PROPERTY = "property",
  GEO_PLACE = "geoPlace",
  HOTEL = "hotel",
  PROFILE = "profile",
  SIGN_UP = "sign-up",
  ARTICLE = "article",
  TOP_20 = "top20",
  REFERRAL = "referral",
  AFFILIATE_HOTEL = "affiliate-hotel"
}

export default ItemProps;

export { DynamicLinksAction };
