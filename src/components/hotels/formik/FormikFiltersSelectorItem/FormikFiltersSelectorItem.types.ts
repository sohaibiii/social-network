import { Control } from "react-hook-form";

import { FiltersSelectorItemProps } from "~/components/hotels/filtersSelectorItem/FiltersSelectorItem.types";

interface FormikDatePickerInterface {
  defaultValue?: boolean;
  name?: string;
  control?: Control<Record<string, string>>;
  testID?: string;
}

export type FormikFiltersSelectorItemProps = FormikDatePickerInterface &
  FiltersSelectorItemProps;
