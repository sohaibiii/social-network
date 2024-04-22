import { MyOrdersTypes } from "~/apiServices/myOrders/myOrders.types";

export interface MyOrderCardProps {
  item: MyOrdersTypes;
  onCancellationCb: (_id: string) => void;
}
