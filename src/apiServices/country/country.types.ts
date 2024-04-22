import { ListSelectorItem } from "~/components/common/ListSelector/ListSelector.types";

export interface Country extends ListSelectorItem {
  name: string;
  code?: string;
  id?: string;
  slug?: string;
}
