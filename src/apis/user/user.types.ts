import { SimpleUser } from "~/types/user";

export interface getUsersListResponse {
  users: SimpleUser[];
}
export interface updateUserLocationProps {
  location: {
    lat: string;
    lon: string;
  };
}
