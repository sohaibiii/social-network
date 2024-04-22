export interface FeedGalleryItem {
  uuid: string;
  type: string;
  width: number;
  height: number;
  mode: string;
  originalPath?: string;
}
export interface NameUUID {
  name: string;
  uuid: string;
}

export interface CreatedBy extends NameUUID {
  roles: string[];
  profileImage: string;
  verified: boolean;
}

interface SimpleSocialItem {
  pkey: string;
  createdBy: CreatedBy;
  timestamp: number;
}

interface SimpleFeedItem extends SimpleSocialItem {
  isFollow: boolean;
  isMine: boolean;
  viewsCount: number;
}

interface SocialItem<T> extends SimpleFeedItem {
  text: string;
  isLiked: boolean;
  likesCount: number;
  gallery: T[];
}

export interface Review extends SocialItem<FeedGalleryItem> {
  repliesCount: number;
  rate: number;
}

export enum ReviewsType {
  ARTICLE = "article",
  HOTEL = "hotel",
  PROPERTY = "property"
}
