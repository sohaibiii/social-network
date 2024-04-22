export default {
  INBOX: "/inbox",
  INBOX_TYPES: "/inbox/types",
  DELETE_INBOX: "/inbox/delete",
  UPDATE_SEEN_STATUS: "/inbox/changeSeenStatus",
  INBOX_BY_ID: (id: string): string => `/inbox/${id}`
};
