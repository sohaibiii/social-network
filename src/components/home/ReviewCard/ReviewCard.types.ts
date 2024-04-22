import { Property } from "~/apiServices/property/property.types";

export interface ReviewCardProps {
  item: Property;
  language?: "ar" | "en" | "fr";
  onlyReview?: boolean;
  analyticsSource?: string;
}
