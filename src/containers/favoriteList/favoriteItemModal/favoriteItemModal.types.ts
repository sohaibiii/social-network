export interface FavoriteItemModalProps {
  isMoveToAnother?: boolean;
  bottomSheetRef: any;
  handleFavouritePressed?: (status: boolean, id?: string) => void;
}
