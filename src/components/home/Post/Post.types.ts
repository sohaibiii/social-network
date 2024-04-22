import { GoogleLocation } from "~/components/rateProperty/addReview/AddReview.types";
import { GenericObject } from "~/types/common";

export interface CreatedBy {
  id: string;
  uuid: string;
  name: string;
  gender: string;
  country: string;
  profile_image: string;
  roles: string[];
  verified?: boolean;
}

export interface Gallery {
  owner: string;
  sources: string;
  image_uuid: string;
  width?: number;
  mode?: string;
  id?: string;
  type?: string;
  height?: number;
  status?: string;
  thumbnail?: string;
  format?: string;
}

interface Post {
  created_by: CreatedBy;
  post_type: string;
  type: string;
  likes: number;
  comments_counter: number;
  status: string;
  hashtags: string[] | null;
  is_valid: boolean;
  is_my_post: boolean;
  isLiked: boolean;
  isFollow: boolean;
  place?: GoogleLocation;
  source: string;
  text: string;
  timestamp: number;
  pkey: string;
  version: number;
  gallery: Gallery[];
  views_count: number;
  isInsidePostDetails?: boolean;
  isSponsorship?: boolean;
  enable_post_actions?: boolean;
  preferences?: GenericObject;
}

export type PostType = Post;
