import { Gallery } from "~/components/home/Post/Post.types";
export interface LikeCommentShareContainerInterface {
  onLikePressed?: (_like: boolean) => void;
  isLiked: boolean;
  pkey: string;
  timestamp: number;
  text: string;
  gallery: Gallery[];
  comments_counter?: number;
  isInsidePostDetails?: boolean;
  isSponsorship?: boolean;
  enable_post_actions?: boolean;
  website?: string;
}

export type LikeCommentShareContainerProps = LikeCommentShareContainerInterface;
