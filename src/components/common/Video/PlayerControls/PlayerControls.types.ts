export interface PlayerControlsType {
  playing: boolean;
  showPreviousAndNext: boolean;
  showSkip: boolean;
  previousDisabled: boolean;
  nextDisabled: boolean;
  onPlay: () => void;
  onPause: () => void;
  skipForwards: () => void;
  skipBackwards: () => void;
  onNext: () => void;
  onPrevious: () => void;
}
