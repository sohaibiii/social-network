import { TopUsersListProps } from "~/containers/pointsBank/components/TopUsersList/TopUsersList.types";
import { AwardsListProps } from "~/containers/pointsBank/pointsBank.types";

export const SLICE_NAME = "pointsBank";

export interface IPointsTerms {
  header: string;
  list: {
    icon: string;
    text: string;
    points: string;
    each: string;
    notes: string;
  }[];
}

export interface IFAQs {
  question: string;
  answer: string;
}

export interface IPointsBank {
  myPoints: number;
  todayPoints: number;
  isLoadingMyPoints: boolean;
  isLoadingTodayPoints: boolean;
}
