interface ButtonInterface {
  onPress?: () => void;
  title?: string;
  icon?: string;
  highlight?: boolean;
}
export type ButtonType = ButtonInterface;
