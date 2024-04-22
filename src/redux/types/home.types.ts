import { EntityState } from "@reduxjs/toolkit";

import { Hero, Timeline, FreeFeeds } from "~/apiServices/home/home.types";
import { Comment } from "~/redux/types/comments.types";
import { Post } from "~/redux/types/posts.types";
import { Reply } from "~/redux/types/replies.types";
import { User } from "~/redux/types/users.types";

export const SLICE_NAME = "home";

export interface HomeInterface {
  hero: Hero[];
  scrollOffsetValue: number;
  specialDestinations: Hero[];
  timeline: Timeline[];
  timelineData: any[];
  isTimelineFinishedLoading: boolean;
  freeFeeds: FreeFeeds;
  isRefreshing: boolean;
  isFetchingRestOfTimelineData: boolean;
  homepagePartRefresh: boolean;
  authenticatedIndecies: number[];
  users: EntityState<User>;
  posts: EntityState<Post>;
  comments: EntityState<Comment>;
  replies: EntityState<Reply>;
}

export enum TimelineTypes {
  FREE_FEEDS = "free-feeds",
  AUTHENTICATE = "authenticate",
  FEED = "feed",
  SLIDER = "slider",
  PUZZLE = "puzzle",
  NEAR_BY = "nearby",
  SPONSORSHIP = "sponsorship"
}

export enum TimelineClasses {
  ARTICLE = "article",
  INFLUENCERS = "influencers",
  PROPERTY = "property",
  REVIEW = "review",
  SPECIAL_DESTINATIONS = "special_destinations"
}
