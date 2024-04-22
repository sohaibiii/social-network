interface CreatedBy {
  id: string;
  uuid: string;
  name: string;
  gender: string;
  country: string;
  roles: string[];
}

interface Gallery {
  owner: string;
  sources: string;
  image_uuid: string;
  width?: number;
  mode?: string;
  id?: string;
  type?: string;
  height?: number;
  status?: string;
}

interface Post {
  created_by: CreatedBy;
  post_type: string;
  type: string;
  likes: number;
  comments_counter: number;
  status: string;
  hashtags: string[] | null;
  is_valid: boolean;
  is_my_post: boolean;
  isLiked: boolean;
  isFollow: boolean;
  source: string;
  text: string;
  timestamp: number;
  pkey: string;
  version: number;
  gallery: Gallery;
}

export type PostType = Post;
