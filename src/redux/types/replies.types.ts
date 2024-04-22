import { EntityId } from "@reduxjs/toolkit";

export const SLICE_NAME = "replies";

export interface Reply {
  index: number;
  timestamp: number;
  status: string;
  abuse_reported: number;
  source: string;
  text: string;
  pkey: string;
  reaction: any;
  replies_counter: number;
  is_valid: boolean;
  type: string;
  likes: number;
  isLiked: boolean;
  commentIndex: EntityId;
}
