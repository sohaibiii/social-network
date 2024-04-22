import { IFilters } from "~/containers/surroundingLandmarks/surroundingLandmarks.types";

export interface MapFilterModalProps {
  filters: IFilters[];
  isHotel?: boolean;
  currentFilterValues: IFilterValues;
  onSave?: (filterValues: IFilterValues) => void;
}

export interface IFilterValues {
  priceRange: null | string;
  starRating: null | string;
  isOpen: boolean;
  selectedFilters: string[];
}
