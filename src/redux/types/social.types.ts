export const SLICE_NAME = "social";

export interface SocialInterface {
  isEdit?: boolean;
  editCommentText?: string;
  commentIndex?: number | undefined;
  isReplyOnComment?: boolean;
  replyCommentText?: string;
  originalCommentorName?: string;
  isOriginalCommentInReplyDetails?: boolean;
}
