interface RoomSelectorContentInterface {
  onPressCb?: (_fields: RoomSelectorType[]) => void;
  roomsDetails?: RoomSelectorType[];
}

export interface RoomSelectorType {
  adults?: number;
  children?: number;
  childrenAges?: number[];
  room?: number;
}
export type RoomSelectorContentProps = RoomSelectorContentInterface;
