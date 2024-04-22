import { TextInput, ViewStyle } from "react-native";

interface Term {
  offset: number;
  value: string;
}

export interface Point {
  lat: number;
  lng: number;
}
interface PlusCode {
  compound_code: string;
  global_code: string;
}

interface MatchedSubString {
  length: number;
  offset: number;
}

interface Geometry {
  location: Point;
  viewport: {
    northeast: Point;
    southwest: Point;
  };
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}
export interface StructuredFormatting {
  main_text: string;
  main_text_matched_substrings: Object[][];
  secondary_text: string;
  secondary_text_matched_substrings: Object[][];
  terms: Term[];
  types: string[];
}

export type GooglePlacesAutocompleteRef = {
  focus: () => void;
  clear: () => void;
};

export type GooglePlacesAutocompleteType = {
  autoFillOnNotFound: boolean;
  currentLocation: boolean;
  currentLocationLabel: string;
  debounce: number;
  disableScroll: boolean;
  enableHighAccuracyLocation: boolean;
  enablePoweredByContainer: boolean;
  fetchDetails: boolean;
  filterReverseGeocodingByTypes: [];
  GooglePlacesDetailsQuery: any;
  GooglePlacesSearchQuery: any;
  GoogleReverseGeocodingQuery: any;
  isRowScrollable: boolean;
  keyboardShouldPersistTaps: "never" | "always" | "handled";
  listEmptyComponent: () => void;
  listLoaderComponent: () => void;
  listUnderlayColor: string;
  listViewDisplayed: boolean;
  keepResultsAfterBlur: boolean;
  minLength: number;
  nearbyPlacesAPI: string;
  numberOfLines: number;
  onFail: () => void;
  onNotFound: () => void;
  onPress: (_rowData: any, _result: any) => void;
  onTimeout: () => void;
  placeholder: string;
  predefinedPlaces: [];
  predefinedPlacesAlwaysVisible: boolean;
  preProcess: () => void;
  query: any;
  renderCurrentLocation: () => JSX.Element;
  children: JSX.Element;
  renderDescription: () => void;
  renderHeaderComponent: () => void;
  renderLeftButton: () => void;
  renderRightButton: () => void;
  renderRow: () => void;
  styles: ViewStyle;
  suppressDefaultStyles: boolean;
  textInputHide: boolean;
  textInputProps: any;
  timeout: number;
  analyticsSource?: string | null;
};

export interface GooglePlaceDetail {
  address_components: AddressComponent[];
  adr_address: string;
  formatted_address: string;
  geometry: Geometry;
  icon: string;
  id: string;
  name: string;
  place_id: string;
  plus_code: PlusCode;
  reference: string;
  scope: "GOOGLE";
  types: string[];
  url: string;
  utc_offset: number;
  vicinity: string;
}
export interface GooglePlaceData {
  description: string;
  id: string;
  matched_substrings: MatchedSubString[];
  place_id: string;
  reference: string;
  structured_formatting: StructuredFormatting;
}
