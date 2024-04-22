import { SimpleUser } from "~/types/user";

export interface UserInfoCardProps {
  item: SimpleUser;
  onUserImagePress: (user: SimpleUser) => () => void;
}
