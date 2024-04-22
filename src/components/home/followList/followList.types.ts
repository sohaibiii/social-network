import { InfluencersResponse } from "~/apiServices/home/home.types";

export interface FollowersListItemProps {
  item: InfluencersResponse;
  setInfluencers: React.Dispatch<React.SetStateAction<InfluencersResponse[]>>;
  analyticsSource: string;
}
