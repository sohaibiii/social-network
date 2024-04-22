import { Currency } from "~/apiServices/property/property.types";
import { Room } from "~/components/hotelDetails/RoomDetailsCard/RoomDetailsCard.types";

interface RoomDetailsCardInterface {
  packageParam: Package;
  currency?: Currency;
  index?: number;
  analyticsSource?: string;
}

export interface Package {
  id?: string;
  name?: string;
  price?: number;
  description?: string;
  rooms?: Room[];
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

export type PackageDetailsCardProps = RoomDetailsCardInterface;
