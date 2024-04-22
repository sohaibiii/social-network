import { SimpleUser } from "~/types/user";

export interface TopUsersListProps extends SimpleUser {
  points?: number;
}
export interface TopUserItemProps {
  item: TopUsersListProps;
  index: number;
}
