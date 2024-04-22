import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Moment } from "moment";

import { CURRENT_ENVIRONMENT } from "~/constants/constants";
import {
  CancellationInfo,
  HotelsCheckinCheckout,
  HotelsTokens,
  HotelsType,
  SLICE_NAME
} from "~/redux/types/hotels.types";
import { EnvironmentTypes } from "~/types/common";

const { HOTEL_SEARCH_CONSTANTS } =
  CURRENT_ENVIRONMENT === EnvironmentTypes.STAGE
    ? require("~/constants/hotels.stage")
    : CURRENT_ENVIRONMENT === EnvironmentTypes.PRODUCTION
    ? require("~/constants/hotels.production")
    : require("~/constants/hotels.dev");

const moment = require("moment-timezone");

const INITIAL_HOTELS_STATE: HotelsType = {
  hotelsPayload: {
    destination: {
      geofence: {
        latitude: "",
        longitude: "",
        radius: HOTEL_SEARCH_CONSTANTS.radius
      }
    },
    checkIn: moment().toDate().toString(),
    checkOut: moment().add(1, "day").toDate().toString(),
    countOfNights: 1,
    occupancy: {
      leaderNationality: HOTEL_SEARCH_CONSTANTS.leaderNationality,
      rooms: [
        {
          adults: 2,
          children: 0,
          childrenAges: []
        }
      ]
    },
    language: HOTEL_SEARCH_CONSTANTS.language,
    timeout: HOTEL_SEARCH_CONSTANTS.timeout,
    sellingChannel: HOTEL_SEARCH_CONSTANTS.sellingChannel,
    availableOnly: HOTEL_SEARCH_CONSTANTS.availableOnly,
    hotelInfo: {
      name: "",
      rating: 0,
      hotelIndex: "",
      hotelImage: ""
    },
    preBookInfo: {
      paymentMethod: "",
      availabilityToken: ""
    },
    reservationInfo: {
      offerId: "",
      packageToken: "",
      roomsToken: [],
      roomsInfo: [],
      price: {
        value: "",
        currency: ""
      }
    },
    paymentInfo: {
      name: "",
      country: {},
      phoneNo: "",
      email: ""
    },
    cancellationInfo: {
      policies: [],
      remarksFormatted: ""
    }
  },
  calendarPayload: {
    checkin: moment().startOf("day").toDate().toString(),
    checkout: moment().startOf("day").add(1, "day").toDate().toString(),
    tempCheckin: moment().startOf("day").toString(),
    tempCheckout: moment().startOf("day").add(1, "day").toDate().toString()
  },
  offerTimestamp: null,
  srk: "",
  accessToken: "",
  hotelsSessionStartTimestamp: "",
  asyncToken: "",
  progressToken: "",
  resultsToken: ""
};

export const hotelsSlice = createSlice({
  name: SLICE_NAME,
  initialState: INITIAL_HOTELS_STATE,
  reducers: {
    setHotelsCheckinCheckout: (state, action: PayloadAction<HotelsCheckinCheckout>) => {
      state.hotelsPayload.checkIn = action.payload.checkIn;
      state.hotelsPayload.checkOut = action.payload.checkOut;
    },
    setCountOfNights: (state, action: PayloadAction<number>) => {
      state.hotelsPayload.countOfNights = action.payload;
    },
    setHotelsAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setHotelsTokens: (state, action: PayloadAction<HotelsTokens>) => {
      state.asyncToken = action.payload.asyncToken;
      state.progressToken = action.payload.progressToken;
      state.resultsToken = action.payload.resultsToken;
    },
    setHotelsSRK: (state, action: PayloadAction<string>) => {
      state.srk = action.payload;
    },
    setRooms: (state, action: PayloadAction<any>) => {
      state.hotelsPayload.occupancy.rooms = action.payload.rooms;
    },
    setHotelsPayload: (state, action: PayloadAction<any>) => {
      state.hotelsPayload = {
        ...state.hotelsPayload,
        ...action.payload
      };
    },
    clearHotelsPayload: state => {
      state.hotelsPayload = INITIAL_HOTELS_STATE.hotelsPayload;
    },
    setHotelsSessionStartTimestamp: (state, action: PayloadAction<Moment | string>) => {
      state.hotelsSessionStartTimestamp = action.payload;
    },
    clearHotelsSessionStartTimestamp: state => {
      state.hotelsSessionStartTimestamp =
        INITIAL_HOTELS_STATE.hotelsSessionStartTimestamp;
    },
    setHotelInfo: (state, action: PayloadAction<any>) => {
      state.hotelsPayload.hotelInfo = action.payload;
    },
    seReservationInfo: (state, action: PayloadAction<any>) => {
      state.hotelsPayload.reservationInfo = action.payload;
    },
    setRoomsInfo: (state, action: PayloadAction<any>) => {
      state.hotelsPayload.reservationInfo.roomsInfo = action.payload;
    },
    setPaymentInfo: (state, action: PayloadAction<any>) => {
      state.hotelsPayload.paymentInfo = action.payload;
    },
    setPrebookInfo: (state, action: PayloadAction<any>) => {
      state.hotelsPayload.prebookInfo = action.payload;
    },
    setCancellationInfo: (state, action: PayloadAction<CancellationInfo>) => {
      state.hotelsPayload.cancellationInfo = action.payload;
    },
    clearHotelBooking: state => {
      state.hotelsPayload = {
        ...INITIAL_HOTELS_STATE.hotelsPayload
      };
      state.offerTimestamp = null;
      state.srk = "";
      state.accessToken = "";
      state.asyncToken = "";
      state.progressToken = "";
      state.resultsToken = "";
      state.calendarPayload.checkin = INITIAL_HOTELS_STATE.calendarPayload.checkin;
      state.calendarPayload.checkout = INITIAL_HOTELS_STATE.calendarPayload.checkout;
      state.calendarPayload.tempCheckin =
        INITIAL_HOTELS_STATE.calendarPayload.tempCheckin;
      state.calendarPayload.tempCheckout =
        INITIAL_HOTELS_STATE.calendarPayload.tempCheckout;
      state.hotelsSessionStartTimestamp =
        INITIAL_HOTELS_STATE.hotelsSessionStartTimestamp;
    },
    clearPaymentInfo: state => {
      state.hotelsPayload.paymentInfo = {
        ...INITIAL_HOTELS_STATE.hotelsPayload.paymentInfo
      };
    },
    setCalendarDates: (state, action: PayloadAction<any>) => {
      state.calendarPayload.checkin = action.payload.checkin;
      state.calendarPayload.checkout = action.payload.checkout;
    },
    setCalendarTempDates: (state, action: PayloadAction<any>) => {
      state.calendarPayload.tempCheckin = action.payload.tempCheckin;
      state.calendarPayload.tempCheckout = action.payload.tempCheckout;
    }
  }
});

export const {
  clearHotelsPayload,
  setHotelsTokens,
  setHotelsSRK,
  setHotelsAccessToken,
  setHotelsCheckinCheckout,
  setCountOfNights,
  setRooms,
  setHotelsPayload,
  setHotelsSessionStartTimestamp,
  clearHotelsSessionStartTimestamp,
  setHotelInfo,
  seReservationInfo,
  setRoomsInfo,
  setPaymentInfo,
  setPrebookInfo,
  setCalendarDates,
  setCalendarTempDates,
  setCancellationInfo,
  clearPaymentInfo,
  clearHotelBooking
} = hotelsSlice.actions;

export default hotelsSlice.reducer;
