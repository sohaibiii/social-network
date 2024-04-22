import { AxiosResponse } from "axios";

import axiosInstance from "../../apiServices/axiosService";

import APIConstants from "./inboxEndpoints";

import { InboxTypes } from "~/containers/inbox/Inbox.types";

const getInbox = (
  page: number,
  limit: number,
  search: string,
  type: InboxTypes
): Promise<AxiosResponse> => {
  let params = {
    page,
    limit
  };

  if (search) {
    params = {
      ...params,
      search
    };
  }
  if (type !== InboxTypes.ALL) {
    params = {
      ...params,
      type
    };
  }
  return axiosInstance.get(`${APIConstants.INBOX}`, {
    params
  });
};

const getInboxById = (id: string): Promise<AxiosResponse> => {
  return axiosInstance.get(`${APIConstants.INBOX_BY_ID(id)}`);
};

const getInboxTypes = (): Promise<AxiosResponse> => {
  return axiosInstance.get(`${APIConstants.INBOX_TYPES}`);
};

const updateSeenStatus = (ids: string[], seenStatus: boolean): Promise<AxiosResponse> => {
  return axiosInstance.patch(`${APIConstants.UPDATE_SEEN_STATUS}`, {
    ids,
    seenStatus
  });
};
const deleteInboxItems = (ids: string[]): Promise<AxiosResponse> => {
  return axiosInstance.patch(`${APIConstants.DELETE_INBOX}`, {
    ids
  });
};

export default {
  getInbox,
  getInboxById,
  getInboxTypes,
  updateSeenStatus,
  deleteInboxItems
};
