interface FiltersSearchIntent {
  language: string;
  onDestinationSelected: (_val: any) => void;
}

export type DestinationSearchProps = FiltersSearchIntent;
