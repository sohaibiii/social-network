import { EntityId } from "@reduxjs/toolkit";

export const SLICE_NAME = "posts";

export interface Post {
  pkey: string;
  text: string;
  comments_counter: number;
  //   created_by
  // gallery:
  isFollow: boolean;
  isLiked: boolean;
  is_my_post: boolean;
  is_new_post?: boolean;
  is_valid: boolean;
  likes: number;
  // place: {address_components: [{long_name: "فلسطين", short_name: "PS", types: ["country", "political"]}],…}
  post_type: string;
  source: string;
  status: string;
  timestamp: number;
  type: string;
  // updated_by: {name: "سفر واي Safarway", id: "a16aa31d-14b5-4d1b-a2d0-c9017e744b63",…}
  version: number;
  views_count: number;
  created_by: EntityId;
}
