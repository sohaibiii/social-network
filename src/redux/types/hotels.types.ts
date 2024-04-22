import { Moment } from "moment";

import { GenericObject } from "~/types/common";

export const SLICE_NAME = "hotels";

export interface HotelsType extends HotelsTokens {
  accessToken: string;
  hotelsSessionStartTimestamp: Moment | string;
  srk: string;
  hotelsPayload: HotelsPayload;
  offerTimestamp: Moment | null;
  countOfNights: number;
  calendarPayload: CalendarPayload;
}
export interface HotelsPayload extends HotelsCheckinCheckout {
  destination: HotelDestination;
  occupancy: HotelOccupancy;
  language: string;
  timeout: number;
  sellingChannel: string;
  availableOnly: boolean;
  countOfNights: number;
  hotelInfo: HotelInfo;
  reservationInfo: ReservationInfo;
  paymentInfo: PaymentInfo;
  prebookInfo: PreBookInfo;
  cancellationInfo: CancellationInfo;
}
export interface HotelsCheckinCheckout {
  checkIn: Moment;
  checkOut: Moment;
}
export interface HotelOccupancy {
  leaderNationality: string;
  rooms: HotelRoom[];
}
export interface HotelRoom {
  adults: number;
  children?: number;
  childrenAges: number[];
}
export interface HotelDestination {
  geofence: HotelDestinationGeoFence;
}
export interface HotelDestinationGeoFence {
  latitude: string;
  longitude: string;
  radius: string;
}
export interface HotelsTokens {
  asyncToken: string;
  progressToken: string;
  resultsToken: string;
}

export interface HotelInfo {
  name: string;
  rating: number;
  hotelIndex: string;
  hotelImage: string;
}

export interface Price {
  value: string;
  currency: string;
}
export interface ReservationInfo {
  offerId: string;
  packageToken: string;
  roomsToken: string[];
  roomsInfo: string[];
  price: Price;
}

export interface PaymentInfo {
  name: string;
  email: string;
  phoneNo: string;
  country: GenericObject | null;
}

export interface PreBookInfo {
  paymentMethod: string | boolean;
  availabilityToken: string;
}

export interface CalendarPayload {
  checkin: string;
  checkout: string;
  tempCheckout: string;
  tempCheckout: string;
}
export interface CancellationInfo {
  policies: string[];
  remarksFormatted: string;
}
