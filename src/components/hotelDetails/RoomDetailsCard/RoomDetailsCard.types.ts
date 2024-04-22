import { Currency } from "~/apiServices/property/property.types";

interface RoomDetailsCardInterface {
  room: Room;
  currency?: Currency;
  analyticsSource?: string;
}

export interface Room {
  id?: string;
  room_name?: string;
  description?: string;
  bed?: number;
  adults?: number;
  images?: string[];
  variations?: RoomVariation[];
}

export interface RoomVariation {
  id: string;
  board?: string;
  price?: number;
  hotel_id?: number;
  package_id?: string;
}

export type RoomDetailsCardProps = RoomDetailsCardInterface;
