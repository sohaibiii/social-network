import { Control } from "react-hook-form";

import { FiltersSelectorItemProps } from "~/components/hotels/filtersSelectorItem/FiltersSelectorItem.types";

interface FormikDatePickerInterface {
  defaultValue?: FilterSelectorType[];
  name?: string;
  control?: Control<Record<string, string>>;
  data: FilterSelectorType[];
  isMultiSelect?: boolean;
  onCheckedCb?: (_item: FilterSelectorType[]) => void;
  renderItem?: (_item: FilterSelectorType) => JSX.Element;
  testID?: string;
  accentColor?: string;
}

export interface FilterSelectorType {
  name: string;
  id: string | number;
}

export type FormikFiltersSelectorItemProps = FormikDatePickerInterface &
  FiltersSelectorItemProps;
