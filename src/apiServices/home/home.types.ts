import { FeaturedImage, Title } from "~/apiServices/destinations/destinations.types";
import { GalleryImage } from "~/types/common";

interface Country {
  ar: string;
  en: string;
  name: string;
}
export interface InfluencersResponse {
  id: string;
  uuid: string;
  name: string;
  gender: "male" | "female";
  profile_image: string;
  profile: string;
  verified: boolean;
  country?: string;
}

export interface Hero {
  country: Country;
  featured_image: FeaturedImage;
  slug: string;
  title: Title;
  type: string;
}
export interface Question {
  correctAnswer: string;
  incorrectAnswers: string[];
  image: GalleryImage;
  text: string;
  pkey: string;
  country: string;
  region: string;
  city: string;
  property: string;
}
export interface IPuzzle {
  questions: Question[];
  pkey: string;
}

interface Params {
  from?: number;
}
export interface Timeline {
  type: string;
  class: string;
  title?: string;
  icon?: string;
  endpoint: string;
  method?: string;
  params: Params;
}

export interface TimelineResponse {
  timeline: Timeline[];
}

export interface FreeFeeds {
  currentPage?: number;
  pageSize?: number;
  baseURL?: string;
  isLoading?: boolean;
}

interface NextIndex {
  social: number;
}
export interface HashtagResponse {
  feeds: any[];
  nextIndex: NextIndex;
}

export interface UserPostsResponse {
  posts: any[];
  nextIndex: NextIndex;
}
