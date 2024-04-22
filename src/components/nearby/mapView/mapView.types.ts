import { SimpleUser } from "~/types/user";

export interface MapViewProps {
  users: SimpleUser[];
  onSelectUser: (user: SimpleUser) => void;
}
