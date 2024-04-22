export interface FeedGalleryItem {
  id: string;
  type: string;
  width: number;
  height: number;
  mode: string;
  originalPath?: string;
  thumbnail?: string;
  format?: string;
  heightInPx?: number;
  widthInPx?: number;
}

export interface PostGalleryType {
  gallery: FeedGalleryItem[];
  pkey?: string | undefined;
  timestamp?: number;
  isSponsorship?: boolean;
  link?: string;
}

export enum GalleryLayoutType {
  VERTICAL = "Vertical",
  HORIZONTAL = "Horizontal",
  PORTRAIT = "Portrait",
  LANDSCAPE = "Landscape"
}
