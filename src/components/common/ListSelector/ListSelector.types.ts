import { StyleProp, TextStyle } from "react-native";
export interface ListSelectorItem {
  name: string;
}

interface CheckBoxInterface {
  containerStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  label?: string;
  defaultValue?: string;
  list?: any[];
  value?: any;
  testID?: string;
  renderItem: (item: ListSelectorItem, selected: any, handleSelected: any) => any;
  hasSearch?: boolean;
  renderContainer?: (_selection: string) => JSX.Element | null | undefined;
}

export type ListSelectorTypes = CheckBoxInterface;
