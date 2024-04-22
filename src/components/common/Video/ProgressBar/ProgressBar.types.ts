interface SeekTime {
  seekTime: number;
}
export interface ProgressBarType {
  currentTime: number;
  duration: number;
  onSlideCapture: (seekTime: SeekTime) => void;
  onSlideStart: () => void;
  onSlideComplete: () => void;
}
