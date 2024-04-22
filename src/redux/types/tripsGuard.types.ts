import { TripsGuardDestination } from "~/components/tripsGuard/CountryAndStateSelector/CountryAndStateSelector.types";

export const SLICE_NAME = "tripsGuard";

export interface ITripsGuard {
  destinations?: TripsGuardDestination[];
}
