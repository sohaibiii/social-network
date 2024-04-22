import React from "react";

export interface FiltersSelectorItemInterface {
  checked?: boolean;
  title?: string;
  children?: React.ReactNode;
  onCheckedCb?: (_checked: boolean) => void;
  accentColor?: string;
}

export type FiltersSelectorItemProps = FiltersSelectorItemInterface;
