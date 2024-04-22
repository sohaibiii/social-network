interface Traveler {
  reference: string;
  lead: boolean;
  type: string;
  title: string;
  firstName: string;
  lasName: string;
}
interface Room {
  packageRoomToken: string;
  travelers: Traveler[];
}
interface HotelInfo {
  id: string | number;
  name: string;
  stars: number;
  type: {
    id: string | number;
    name: string;
  };
  address: string;
  zipCode: string;
  city: {
    id: 1;
    name: string;
    countryId: number;
  };
  country: {
    id: number;
    name: string;
    iso: string;
  };
  geolocation: {
    latitude: string;
    longitude: string;
  };
  recommended: boolean;
  specialDeal: boolean;
  shortDescription: string;
  mainImage: {
    id: string | number;
    name: string;
    url: string;
  };
  telephone: string;
  fax: string;
  email: string | null;
}

interface MyOrdersInterface {
  mid: string;
  userId: string;
  status: string;
  amount: number;
  currency: string;
  rooms: Room[];
  payer_name: string;
  payer_email: string;
  payer_address: string;
  payer_phone: string;
  hotelInfo: HotelInfo;
  createdAt: string;
  reservation: any;
  canCancel: boolean;
}

export type MyOrdersTypes = MyOrdersInterface;
