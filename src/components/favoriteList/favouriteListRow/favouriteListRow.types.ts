import { IFavouriteList } from "~/apiServices/settings/settings.types";

export interface FavouriteListRowProps {
  item: IFavouriteList;
}
export interface MoveToAnotherListFooterProps {
  setIsVisible: (_val: boolean) => void;
}
