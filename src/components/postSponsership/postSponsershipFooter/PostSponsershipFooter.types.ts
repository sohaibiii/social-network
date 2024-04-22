interface PostSponsershipFooterTag {
  action: string;
  label: string;
  link: string;
}
interface PostSponsershipFooterInterface {
  tags?: PostSponsershipFooterTag;
  description?: string;
  title?: string;
  website?: string;
}

export enum PostSponsershipFooterTagAction {
  OPEN_LINK = "OPEN_LINK"
}

export type PostSponsershipFooterType = PostSponsershipFooterInterface;
