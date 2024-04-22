export interface NameUUID {
  name: string;
  uuid: string;
}

export interface CreatedBy extends NameUUID {
  roles: string[];
  profileImage: string;
  verified: boolean;
}

export interface Comment {
  index: number;
  pkey: string;
  createdBy: CreatedBy;
  text: string;
  repliesCount: number;
  isLiked: boolean;
  likesCount: number;
  timestamp: number;
}

export enum CommentsType {
  COMMENT = "comment",
  ARTICLE = "article",
  REPLY = "reply",
  POST = "post"
}
