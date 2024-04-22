import {
  GooglePlaceData,
  GooglePlaceDetail
} from "~/components/common/GooglePlaces/GooglePlaces.types";

export type keyboardShouldPersistTapsType = "always" | "never" | "handled" | undefined;

export interface GooglePlacesAutocompleteInterface {
  hasCurrentLocation?: boolean;
  keyboardShouldPersistTaps?: keyboardShouldPersistTapsType;
  keepResultsAfterBlur?: boolean;
  getCurrentLocationCb?: () => void;
  googlePlaceClickedCb?: (
    _data: GooglePlaceData,
    _details: GooglePlaceDetail | null
  ) => void;
  analyticsSource: string | null;
}

export type GooglePlacesAutocompleteProps = GooglePlacesAutocompleteInterface;
