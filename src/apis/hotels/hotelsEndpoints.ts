export default {
  HOTEL: (srk: string, hotelIndex: string, btravel_results_token: string): string =>
    `/proxy-bthotels/reseller/api/hotels/v1/search/results/${srk}/hotels/${hotelIndex}/details?token=${btravel_results_token}&includeExtendedDetails=1`,
  OFFERS: (srk: string, hotelIndex: string, btravel_results_token: string): string =>
    `/proxy-bthotels/reseller/api/hotels/v1/search/results/${srk}/hotels/${hotelIndex}/offers?token=${btravel_results_token}`,
  ROOMS: (
    srk: string,
    hotelIndex: string,
    btravel_results_token: string,
    offerId: string
  ): string =>
    `/proxy-bthotels/reseller/api/hotels/v1/search/results/${srk}/hotels/${hotelIndex}/offers/${offerId}/rooms?token=${btravel_results_token}`,
  CANCELLATION_TERMS: (id: string, room_id: string): string =>
    `/hotels/${id}/rooms/${room_id}`,
  AUTO_COMPLETE: (id: string, size = 20): string =>
    `/search?scope=hotel&from=0&size=${size}&term=${id}`,
  GET_ACCESS_TOKEN: "/bthotels?scope=hotel-search",
  SEARCH: "/proxy-bthotels/reseller/api/hotels/v1/search/start",
  PROGRESS: "/proxy-bthotels/reseller/api/hotels/v1/search/progress",
  RESULTS: (srk: string): string =>
    `/proxy-bthotels/reseller/api/hotels/v1/search/results/${srk}`,
  PRE_BOOK: (srk: string, hotelIndex: string, offerId: string): string =>
    `/proxy-bthotels/reseller/api/hotels/v1/search/results/${srk}/hotels/${hotelIndex}/offers/${offerId}/availability`,
  BOOK: (srk: string, hotelIndex: string, offerId: string): string => `/bthotels/book`
};
