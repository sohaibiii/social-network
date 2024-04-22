export interface InViewPortTypes {
  onChange: (_isInViewport: boolean) => void;
  useFullWidth?: boolean;
  disabled?: boolean;
  delay?: number;
}

export interface InViewPortState {
  rectTop: number;
  rectBottom: number;
  rectWidth: number;
}

export interface Timer {
  ref(): this;
  unref(): this;
  hasRef(): boolean;
  refresh(): this;
  [Symbol.toPrimitive](): number;
}
