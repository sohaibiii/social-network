import { Moment } from "moment";

export interface HotelsSearchAgainInterface {
  handleDateSaved: (_start: Moment, _end: Moment) => void;
  handleRoomSelected: () => void;
  analyticsSource?: string;
}

export type HotelsSearchAgainProps = HotelsSearchAgainInterface;
