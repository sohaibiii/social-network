import { Control } from "react-hook-form";

interface FormikRoomBookingFormInterface {
  name?: string;
  index?: number;
  control?: Control<Record<string, string>>;
  testID?: string;
  register?: (name: string) => void;
}

export type FormikRoomBookingFormProps = FormikRoomBookingFormInterface;
