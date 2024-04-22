import { IMapCategories } from "~/containers/surroundingLandmarks/surroundingLandmarks.types";

export interface MapPropertyTypesFiltersProps {
  activeCategory: number;
  categories: IMapCategories[];
  onCategoryPress: (categoryId: number) => void;
}
