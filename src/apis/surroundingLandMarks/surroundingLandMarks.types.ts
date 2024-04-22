import { IFilterValues } from "~/components/surroundingLandmarks/mapFilterModal/mapFilterModal.types";

export interface GetPropertyByLocationProps {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
  filter?: number;
  filterValues: IFilterValues;
  isHotel?: boolean;
}
