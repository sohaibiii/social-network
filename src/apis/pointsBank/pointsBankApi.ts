import {
  getTopUsersResponse,
  requestAwardProps,
  requestAwardResponse
} from "./pointsBank.types";

import pointsBankEndpoints from "~/apis/pointsBank/pointsBankEndpoints";
import axiosInstance from "~/apiServices/axiosService";
import { AwardsListProps } from "~/containers/pointsBank/pointsBank.types";
import { IPointsTerms } from "~/redux/types/pointsBank.types";
import { IFAQs } from "~/redux/types/pointsBank.types";

export const getAwardsAPI = async (): Promise<AwardsListProps[]> => {
  const response = await axiosInstance.get(pointsBankEndpoints.getAwards);

  return response.data;
};

export const requestAwardAPI = async (
  data: requestAwardProps
): Promise<requestAwardResponse> => {
  const response = await axiosInstance.post(pointsBankEndpoints.requestAward, data);

  return response.data;
};

export const pointsTermsAPI = async (): Promise<IPointsTerms> => {
  const response = await axiosInstance.get(pointsBankEndpoints.pointsTerms);

  return response.data;
};

export const myPointsAPI = async (): Promise<{ points: number }> => {
  const response = await axiosInstance.get(pointsBankEndpoints.myPoints);

  return response.data;
};

export const getTopUsersAPI = async (days: string): Promise<getTopUsersResponse[]> => {
  const endpoint = `${pointsBankEndpoints.getTopUsers}${days}/?source=app`;

  const response = await axiosInstance.get(endpoint);

  return response.data;
};

export const getRewardsAPI = async (): Promise<{
  wheel_data: string[];
  next_timestamp: number;
  time: number;
}> => {
  const endpoint = `${pointsBankEndpoints.getRewards}?source=app`;

  const response = await axiosInstance.get(endpoint);

  return response.data;
};

export const getFAQsAPI = async (): Promise<IFAQs[]> => {
  const response = await axiosInstance.get(pointsBankEndpoints.getFAQs);

  return response.data;
};

export const spinWheelAPI = async (): Promise<{
  index: number;
}> => {
  const endpoint = `${pointsBankEndpoints.spinWheel}?source=app`;

  const response = await axiosInstance.post(endpoint);

  return response.data;
};

export const todayPointsAPI = async (): Promise<{ points: number }> => {
  const response = await axiosInstance.get(pointsBankEndpoints.todayPoints);

  return response.data;
};
