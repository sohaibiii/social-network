import { Hotel } from "~/containers/hotelsList/HotelsList.types";

interface HotelsListCardInterface {
  hotel: Hotel;
  minPrice?: { value: string; currency: string };
  onHotelPressed: (_hotel: Hotel) => void;
}

export type HotelsListCardProps = HotelsListCardInterface;
