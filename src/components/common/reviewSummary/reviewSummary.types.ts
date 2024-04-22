import { GenericObject } from "~/types/common";

export interface ReviewSummaryProps {
  rate: {
    rate_calculated: number;
    rate_distribution: GenericObject;
    contributes: number;
  };
}
