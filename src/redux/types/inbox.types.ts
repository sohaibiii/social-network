import { InboxItemTypes } from "~/apiServices/inbox/inbox.types";

export const SLICE_NAME = "inbox";

export interface IInbox {
  inbox: InboxItemTypes[];
  badges: number;
}
