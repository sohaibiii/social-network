export interface TripsGuardDestination {
  key?: string;
  code?: string;
  name?: string;
}

interface CountryAndStateSelectorInterface {
  handleItemSelectedCb?: (_item: TripsGuardDestination) => void;
  defaultValue?: TripsGuardDestination;
  prefixText?: string;
  testID?: string;
  isPassport?: boolean;
}

export type CountryAndStateSelectorTypes = CountryAndStateSelectorInterface;
