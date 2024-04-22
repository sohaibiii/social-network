import { Review } from "~/apiServices/review/review.types";

export enum ReviewCardAnalyticsTypes {
  ARTICLE = "article",
  PROPERTY = "property",
  HOTEL = "hotel",
  REVIEW = "review"
}

export interface ReviewCardProps {
  item: {
    pkey: string;
    created_by: {
      name: string;
      profile: string;
      uuid: string;
    };
    index: number;
    rate: number;
    text: string;
    date: string;
    isLiked: boolean;
    likes: number;
    gallery?: {
      id: string;
    }[];
    votes?: number;
    voteStatus?: number;
  };
  itemsLength?: number;
  index?: number;
  title?: string;
  withStars?: boolean;
  isArticle?: boolean;
  isRegularComment?: boolean;
  onVoteChange?: (value: number) => void;
  onEditCb?: (review: Review) => void;
  onDeleteCb?: (pkey: string) => void;
  analyticsType?: ReviewCardAnalyticsTypes;
}
