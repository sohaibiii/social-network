import { Currency } from "~/apiServices/property/property.types";
import {
  Room,
  RoomVariation
} from "~/components/hotelDetails/RoomDetailsCard/RoomDetailsCard.types";

interface VariationDetailsCardInterface {
  variation: RoomVariation;
  room: Room;
  onShowDescription?: () => void;
  onShowGallery?: () => void;
  currency?: Currency;
}

export type VariationDetailsCardProps = VariationDetailsCardInterface;
