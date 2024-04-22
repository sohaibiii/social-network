export interface FooterInterface {
  onPreviousPressed: () => void;
  onNextPressed: () => void;
  onFinishPressed: () => void;
  height: number;
  currentPage: number;
  numberOfPages: number;
  isNextDisabled?: boolean;
  lastButtonLabel?: string;
}

export type FooterProps = FooterInterface;
