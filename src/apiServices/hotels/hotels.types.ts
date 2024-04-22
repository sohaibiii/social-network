interface HotelRoomSearchType {
  adults: number;
  childrenAges: number[];
  children: number;
}
export interface HotelGetAccessTokenResponse {
  access_token: string;
  expires_at: Date;
  token_type: string;
  expires_in: number;
}

export interface HotelSearchPayload {
  destination: {
    geofence: {
      latitude: string | number;
      longitude: string | number;
      radius: string | number;
    };
  };
  checkIn: string;
  checkOut: string;
  occupancy: {
    leaderNationality: string | number;
    rooms: HotelRoomSearchType[];
  };
  language: string;
  timeout: number;
  sellingChannel: string;
  availableOnly: boolean;
}

export interface HotelResultsResponse {
  hotels: Hotel[];
  _links: Links;
}

export interface Links {
  self: Self;
}

export interface Self {
  href: string;
}

export interface Hotel {
  rateTags: string[];
  minPrice: Price;
  name: string;
  index: string;
  details: Details;
  nonRefundable: BoardBasis[];
  specialDeal: boolean;
  boardBasis: BoardBasis[];
  recommended: boolean;
}

export interface BoardBasis {
  code: string;
  price: Price;
}

export interface Price {
  currency: string;
  value: number;
}

export interface Details {
  zipCode: string;
  country: Country;
  images: { [key: string]: Image };
  address: string;
  city: City;
  telephone: string;
  stars: number;
  shortDescription: string;
  type: Type;
  descriptions: Descriptions;
  recommended: boolean;
  mainImage: Image;
  translations: string[];
  name: string;
  id: number;
  categories: Type[];
  fax?: string;
  facilities: Facility[];
  specialDeal: boolean;
  geolocation: Geolocation;
}

export interface Type {
  name: string;
  id: number;
}

export interface City {
  name: string;
  id: number;
  countryId: number;
}

export interface Country {
  iso: string;
  name: string;
  id: number;
}

export interface Descriptions {
  essentialInformation: string;
  short: string;
  location: string;
  facilities: string;
  full: string;
}

export interface Facility {
  name: string;
  id: number;
  icon?: string;
}

export interface Geolocation {
  latitude: string;
  longitude: string;
}

export interface Image {
  name: string;
  id: number;
  url: string;
}

export interface HotelSearchResponse {
  _links: HotelSearchLinks;
  countOffers: number;
  progress: number;
  tokens: Tokens;
  countHotels: number;
  srk: string;
  status: string;
}

export interface HotelSearchLinks {
  summary: Async;
  async: Async;
  self: Async;
  progress: Async;
}

export interface Async {
  href: string;
}

export interface Tokens {
  async: string;
  progress: string;
  results: string;
}

export interface HotelProgressResponse {
  _links: HotelProgressLinks;
  countOffers: number;
  progress: number;
  tokens: HotelProgressToken;
  countHotels: number;
  srk: string;
  status: HotelProgressStatus;
}

export enum HotelProgressStatus {
  COMPLETED = "COMPLETED",
  IN_PROGRESS = "IN_PROGRESS"
}

export interface HotelProgressLinks {
  self: Results;
  results: Results;
}

export interface Results {
  href: string;
}

export interface HotelProgressToken {
  progress: string;
}
