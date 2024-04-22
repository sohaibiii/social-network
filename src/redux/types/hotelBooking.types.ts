import { Moment } from "moment";

import { Currency } from "~/apiServices/property/property.types";
import { RoomSelectorType } from "~/components/hotelsSearch/RoomSelectorContent/RoomSelectorContent.types";

export const SLICE_NAME = "hotelBooking";

export type HotelBookingType = HotelBookingRoomDetails &
  HotelBookingDate &
  HotelBookingSession &
  HotelCurrencyType &
  HotelBookingTravelorId &
  HotelBookingHotel;

export interface HotelBookingDate {
  checkin: Moment;
  checkout: Moment;
}

export interface HotelBookingHotel {
  hotelName: string;
  hotelRating: number;
  hotelId: string;
}
export interface HotelBookingSession {
  session: string;
  sessionCreatedAt: string;
}
export interface HotelBookingTravelorId {
  travelorHotelId: string;
}
export interface HotelBookingRoomDetails {
  roomsDetails: RoomSelectorType[];
}
export interface HotelCurrencyType {
  hotelsCurrency: Currency;
}
