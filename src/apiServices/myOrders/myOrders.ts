import { myOrdersAPI } from "~/apis/";
import { MyOrdersTypes } from "~/containers/myOrders/MyOrders.types";
import { logError } from "~/utils/";

const getMyOrders: (
  _page: number,
  _limit: number
) => Promise<{ data: MyOrdersTypes[] }> = async (page: number, limit: number) => {
  try {
    const { data } = await myOrdersAPI.getMyOrders(page, limit);
    return { data };
  } catch (error) {
    logError(`Error: getMyOrders --myOrders.ts-- ${error}`);
    throw error;
  }
};

const getMyOrderDetails: (_id: string) => Promise<{ data: MyOrdersTypes[] }> = async (
  id: string
) => {
  try {
    const { data } = await myOrdersAPI.getMyOrderDetails(id);
    if (data?.reservation) {
      return { data };
    } else {
      const { cancellationPolicy = {}, serviceDates = {} } = data?.prebookData || {};
      const { packageRooms = [] } = data?.prebookData?.package || {};
      const reshapedRooms = packageRooms.map(item => item.room);
      const { type, ...rest } = serviceDates;

      const reshapedServiceDates = {
        ...rest,
        durationType: type
      };

      const reservation = {
        id: "N/A",
        service: {
          cancellationPolicy,
          rooms: reshapedRooms,
          serviceDates: reshapedServiceDates
        }
      };

      const reshapedData = {
        ...data,
        reservation
      };
      return { data: reshapedData };
    }
  } catch (error) {
    logError(`Error: getMyOrderDetails --myOrders.ts-- id=${id} ${error}`);
    throw error;
  }
};

const cancelOrder: (_id: string) => Promise<unknown> = async (id: string) => {
  try {
    const { data } = await myOrdersAPI.cancelOrder(id);
    return { data };
  } catch (error) {
    logError(`Error: cancelOrder --myOrders.ts-- id=${id} ${error}`);
    throw error;
  }
};
const getOrderVoucher: (_id: string) => Promise<unknown> = async (id: string) => {
  try {
    const { data } = await myOrdersAPI.getOrderVoucher(id);
    return { data };
  } catch (error) {
    logError(`Error: getOrderVoucher --myOrders.ts-- id=${id} ${error}`);
    throw error;
  }
};

export default {
  getMyOrders,
  getMyOrderDetails,
  cancelOrder,
  getOrderVoucher
};
