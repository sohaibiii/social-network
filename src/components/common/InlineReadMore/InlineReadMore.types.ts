import { StyleProp, TextStyle } from "react-native";

import { CTextProps } from "../CText/CText.types";
export interface Match {
  getType(): string;
}

export enum InlineReadMoreMode {
  FLEX = "flex",
  FULL_HEIGHT_WIDTH = "fullHeightWidth"
}

export enum InlineReadMoreType {
  SUMMARY = "summary",
  BUDGET = "budget"
}

interface InlineReadMoreInterface {
  style?: StyleProp<TextStyle>;
  maxNumberOfLinesToShow?: number;
  isAutoLink?: boolean;
  hasReadLess?: boolean;
  children?: Element;
  textProps?: CTextProps;
  onLongPress?: () => void;
  mode?: InlineReadMoreMode;
  slug?: string;
  type?: InlineReadMoreType;
  analyticsSource?: string;
  pkey?: string;
  index?: string;
  isInitiallyExpanded?: boolean;
  onExpanded?: (_isExpanded: boolean) => void;
}

export type InlineReadMoreProps = InlineReadMoreInterface;
