import { EntityId } from "@reduxjs/toolkit";

export const SLICE_NAME = "users";

export interface User {
  country: string;
  country_code: string;
  gender: string;
  id: string;
  name: string;
  profile: string;
  profile_image: string;
  uuid: string;
  verified: boolean;
  isFollow: boolean;
  postsId: EntityId[];
  // commentsId: EntityId[];
}
