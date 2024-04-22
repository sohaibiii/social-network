export default {
  MY_ORDERS: "/bthotels/book?sortBy=createdAt:desc",
  MY_ORDER_DETAILS: (id: string): string => `/bthotels/book/${id}`,
  GET_ORDER_VOUCHER: (id: string): string => `/bthotels/book/${id}/voucher`,
  CANCEL_ORDER_BY_ID: (id: string): string => `/bthotels/cancel-book/${id}`
};
