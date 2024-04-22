interface FiltersSearchIntent {
  latitude: number;
  longitude: number;
  onBackPressedCb: () => void;
  onHotelPressedCb: (_val: any) => void;
}

export type FiltersSearchProps = FiltersSearchIntent;
