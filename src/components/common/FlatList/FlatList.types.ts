import { FlatListProps } from "react-native";

export type CustomFlatListProps<T> = FlatListProps<T> & {
  initialLoader?: boolean;
  flatListRef?: any;
  footerLoader?: boolean;
  emptyText?: string;
  ListEmptyComponent?: JSX.Element;
  ListFooterComponent?: JSX.Element;
  backgroundColor?: string;
  initialSkeleton?: React.ReactNode;
};
