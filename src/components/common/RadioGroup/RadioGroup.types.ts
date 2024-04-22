interface RadioGroupInterface<T> {
  children?: JSX.Element[];
  defaultValue?: string;
  onToggle?: (_value: T) => void;
  row?: boolean;
}
export type RadioGroupProps = RadioGroupInterface;
