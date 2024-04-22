export interface requestAwardProps {
  item_id: string;
}
export interface requestAwardResponse {
  pkey: string;
  ts: number;
  status: string;
  type: string;
  requested: string;
  item_id: string;
}
export interface getTopUsersResponse {
  user: string;
  points: number;
}
