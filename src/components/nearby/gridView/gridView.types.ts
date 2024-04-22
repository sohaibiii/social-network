import { SimpleUser } from "~/types/user";

export interface GridViewProps {
  users: SimpleUser[];
  onUserImagePress: (user: SimpleUser) => () => void;
}
