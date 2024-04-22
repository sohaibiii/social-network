import { InboxTypes } from "~/containers/inbox/Inbox.types";

interface InboxItemInterface {
  id: string;
  title: string;
  description: string;
  seenAt: string;
  sender: InboxSender;
  type: InboxTypes;
  time: string[];
  wasSeen: boolean;
}

export interface InboxTypesResponse {
  _id: string;
  name: InboxTypes;
  canBeDeleted: false;
}
interface InboxSender {
  id: string;
  name: string;
}

export type InboxItemTypes = InboxItemInterface;
