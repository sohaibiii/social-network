import { createAsyncThunk } from "@reduxjs/toolkit";

import inboxService from "~/apiServices/inbox";
import { InboxTypes } from "~/containers/inbox/Inbox.types";

export const getInboxThunk = createAsyncThunk(
  `/getInbox`,
  async ({
    page,
    limit,
    search,
    type
  }: {
    page: number;
    limit: number;
    search: string;
    type: InboxTypes;
  }) => {
    const { results, totalResults } = await inboxService.getInbox(
      page,
      limit,
      search,
      type
    );
    return { inboxItems: results, reset: page === 1, totalResults };
  }
);
