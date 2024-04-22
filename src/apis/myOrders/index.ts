import { AxiosResponse } from "axios";

import axiosInstance from "../../apiServices/axiosService";

import APIConstants from "./myOrdersEndpoints";

const getMyOrders = (page: number, limit: number): Promise<AxiosResponse> => {
  const params = { page, limit };
  return axiosInstance.get(`${APIConstants.MY_ORDERS}`, {
    params
  });
};

const getMyOrderDetails = (id: string): Promise<AxiosResponse> => {
  return axiosInstance.get(`${APIConstants.MY_ORDER_DETAILS(id)}`);
};

const cancelOrder = (id: string): Promise<AxiosResponse> => {
  return axiosInstance.post(`${APIConstants.CANCEL_ORDER_BY_ID(id)}`);
};

const getOrderVoucher = (id: string): Promise<AxiosResponse> => {
  return axiosInstance.get(`${APIConstants.GET_ORDER_VOUCHER(id)}`);
};

export default {
  getMyOrders,
  getMyOrderDetails,
  cancelOrder,
  getOrderVoucher
};
