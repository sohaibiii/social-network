import { Dispatch, SetStateAction } from "react";

export interface AddReviewInterface {
  setIsNextDisabled: Dispatch<SetStateAction<boolean>>;
}
export type AddReviewProps = AddReviewInterface;
