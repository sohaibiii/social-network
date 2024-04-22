export interface PostCommentType {
  timestamp: number;
  created_by: string;
  replies_counter: number;
  isLiked: boolean;
  text: string;
  showFirstReply?: boolean;
  isOriginalCommentInReplyDetails?: boolean;
  isSponserShip?: boolean;
}
