export interface RoomFiltersContentInterface {
  filterOptions?: {
    name: string;
  }[];
  selectedRoomFilters?: string[];
  onFilter?: (_filteredData: string[]) => void;
}

export type RoomFiltersContentProps = RoomFiltersContentInterface;
