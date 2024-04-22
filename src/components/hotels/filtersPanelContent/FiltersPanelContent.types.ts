import { FieldValues } from "react-hook-form";
import { Control, UseFormSetValue } from "react-hook-form/dist/types/form";

import { HotelFilterData } from "~/containers/hotelsList/HotelsList.types";

interface FiltersPanelContentIntent {
  onBackPressedCb?: () => void;
  latitude: number;
  longitude: number;
  hasAllFilters: boolean;
  setValue: UseFormSetValue<FieldValues>;
  control: Control;
  orderValue?: string;
}

export type FiltersPanelContentProps = FiltersPanelContentIntent;
