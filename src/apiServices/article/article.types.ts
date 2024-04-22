export interface NameUUID {
  name: string;
  uuid: string;
}

export interface CreatedBy extends NameUUID {
  roles: string[];
  profileImage: string;
  verified: boolean;
}

export interface GalleryImage {
  owner: string;
  source: string;
  uuid: string;
}

interface SimpleSocialItem {
  pkey: string;
  createdBy: CreatedBy;
  timestamp: number;
}

interface SimpleFeedItem extends SimpleSocialItem {
  isFollow: boolean;
  isMine: boolean;
  viewsCount: number;
}

interface ArticleTitle {
  en: string;
  ar: string;
  fr?: string;
}
export interface SimpleArticle {
  featuredImageUUID: string;
  title: ArticleTitle;
  slug: string;
  summary: string;
  viewsCount: number;
  pkey: string;
  traverCategories: Category[];
}

export interface ArticleFeed extends SimpleArticle, SimpleFeedItem {}

export interface Article extends ArticleFeed {
  gallery: GalleryImage[];
  body: string;
  travelCategories: Category[];
}

export interface Articles {
  articles: SimpleArticle[];
  totalArticles: number;
}

export interface ArticlesCetegory {
  id: number;
  title: string;
}

export interface Category {
  id: number;
  name: string;
}
