import { inboxAPI } from "~/apis/";
import { InboxItemTypes, InboxTypesResponse } from "~/apiServices/inbox/inbox.types";
import { InboxTypes } from "~/containers/inbox/Inbox.types";
import { logError } from "~/utils/";

const getInbox: (
  _page: number,
  _limit: number,
  _search: string,
  _type: InboxTypes
) => Promise<{ results: InboxItemTypes[]; totalResults: number }> = async (
  page: number,
  limit: number,
  search: string,
  type: InboxTypes
) => {
  try {
    const { data } = await inboxAPI.getInbox(page, limit, search, type);
    const { query = {} } = data || {};
    const { results, totalResults } = query;
    return { results, totalResults };
  } catch (error) {
    logError(`Error: getInbox --inbox.ts-- ${error}`);
    throw error;
  }
};

const getInboxById: (
  _id: string
) => Promise<{ results: InboxItemTypes[]; totalResults: number }> = async (
  id: string
) => {
  try {
    const { data } = await inboxAPI.getInboxById(id);
    return data;
  } catch (error) {
    logError(`Error: getInboxById --inbox.ts-- id=${id} ${error}`);
    throw error;
  }
};

const deleteInboxItems: (
  _ids: string[]
) => Promise<{ results: InboxItemTypes[]; totalResults: number }> = async (
  ids: string[]
) => {
  try {
    const { data } = (await inboxAPI.deleteInboxItems(ids)) || {};
    return data;
  } catch (error) {
    logError(`Error: getInbox --inbox.ts-- ${error}`);
    throw error;
  }
};

const updateSeenStatus: (
  _ids: string[],
  _seenStatus: boolean
) => Promise<{ results: InboxItemTypes[]; totalResults: number }> = async (
  ids: string[],
  seenStatus: boolean
) => {
  try {
    const { data } = (await inboxAPI.updateSeenStatus(ids, seenStatus)) || {};
    return data;
  } catch (error) {
    logError(`Error: updateSeenStatus --inbox.ts-- ${error}`);
    throw error;
  }
};

const getInboxTypes: () => Promise<InboxTypesResponse[]> = async () => {
  try {
    const { data } = (await inboxAPI.getInboxTypes()) || {};
    return data;
  } catch (error) {
    logError(`Error: getInboxTypes --inbox.ts-- ${error}`);
    throw error;
  }
};

export default {
  getInbox,
  getInboxById,
  updateSeenStatus,
  getInboxTypes,
  deleteInboxItems
};
