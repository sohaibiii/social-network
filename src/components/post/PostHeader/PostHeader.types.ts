import { Gallery } from "~/components/home/Post/Post.types";
import { GoogleLocation } from "~/components/rateProperty/addReview/AddReview.types";
export interface PostHeaderTypes {
  pkey: string;
  place: GoogleLocation;
  name: string;
  profile_image: string;
  uuid: string;
  timestamp: number;
  isMyPost?: boolean;
  isFollow?: boolean;
  text: string;
  tags: any[];
  gallery: Gallery[];
  verified?: boolean;
  roles?: string[];
  isInsidePostDetails?: boolean;
}
