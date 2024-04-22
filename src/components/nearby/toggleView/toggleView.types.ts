export interface ToggleViewProps {
  onToggleButtonPress: (value: boolean) => () => void;
  mapViewMode: boolean;
}
