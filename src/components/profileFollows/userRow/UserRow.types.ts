export interface UserRowInterface {
  user: UserRowDetails;
}

export type UserRowDetails = {
  uuid: number;
  name?: string;
  posts?: number;
};

export type UserRowType = UserRowInterface;
