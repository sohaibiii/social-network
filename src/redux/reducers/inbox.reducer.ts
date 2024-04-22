import { createSlice } from "@reduxjs/toolkit";

import { getInboxThunk } from "~/redux/thunk/inbox.thunk";
import { IInbox, SLICE_NAME } from "~/redux/types/inbox.types";

const INITIAL_HOME_STATE: IInbox = {
  inbox: [],
  badges: 0
};

export const inboxSlice = createSlice({
  name: SLICE_NAME,
  initialState: INITIAL_HOME_STATE,
  reducers: {
    setBadges(state, { payload }) {
      state.badges = payload;
    },
    incrementBadges(state) {
      state.badges += 1;
    },
    updateSeenStatus(state, { payload }) {
      const inboxMessage = state.inbox?.find(item => item.id === payload.id);
      if (inboxMessage) {
        if (payload.wasSeen) {
          state.badges -= 1;
        } else {
          state.badges += 1;
        }
        inboxMessage.wasSeen = payload.wasSeen;
      }
    },
    deleteInboxItem(state, { payload }) {
      state.inbox = state.inbox?.filter(item => item.id !== payload.id);
      if (!payload.wasSeen) {
        state.badges -= 1;
      }
    },
    bulkUpdateSeenStatus(state, { payload }) {
      let count = 0;

      state.inbox.forEach(item1 => {
        const itemFromArr2 = payload.inbox.find((item2: string) => item2 === item1.id);
        if (itemFromArr2) {
          if (item1.wasSeen !== payload.wasSeen) {
            count += 1;
          }
          item1.wasSeen = payload.wasSeen;
        }
      });
      if (payload.wasSeen) {
        state.badges -= count;
      } else {
        state.badges += count;
      }
    },
    bulkDeleteInboxItems(state, { payload }) {
      state.inbox = state.inbox.filter(item => {
        if (payload.inbox.includes(item.id)) {
          if (!item.wasSeen) {
            state.badges -= 1;
          }
          return false;
        }
        return true;
      });
    },
    clearInbox(state) {
      state.inbox = [];
    },
    insertInboxItem(state, { payload }) {
      state.inbox = [payload, ...state.inbox];
    },
    clearInboxAndBadges(state) {
      state.inbox = [];
      state.badges = 0;
    }
  },
  extraReducers: builder => {
    builder.addCase(getInboxThunk.fulfilled, (state, { payload }) => {
      const { inboxItems, reset } = payload || {};

      if (reset) {
        state.inbox = inboxItems || [];
      } else {
        state.inbox = inboxItems ? [...state.inbox, ...inboxItems] : [];
      }
    });
  }
});

export const {
  updateSeenStatus,
  deleteInboxItem,
  setBadges,
  incrementBadges,
  insertInboxItem,
  clearInboxAndBadges,
  bulkDeleteInboxItems,
  bulkUpdateSeenStatus,
  clearInbox
} = inboxSlice.actions;

export default inboxSlice.reducer;
