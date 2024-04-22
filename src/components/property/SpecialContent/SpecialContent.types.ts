import { FeedGalleryItem } from "~/components/post/PostGallery/PostGallery.types";

export interface SpecialContentType {
  currency: string;
  description: string;
  image: FeedGalleryItem[];
  label: string;
  link: string;
  price: number;
}
