import { Category } from "~/apiServices/article/article.types";
import { FeaturedImage, Title } from "~/apiServices/destinations/destinations.types";

interface ArticleCardInterface {
  title: Title;
  language: string;
  featured_image: FeaturedImage;
  slug: string;
  travel_categories?: Category[];
  shouldRenderProgressive?: boolean;
  analyticsSource?: string;
}

export type ArticleCardProps = ArticleCardInterface;
