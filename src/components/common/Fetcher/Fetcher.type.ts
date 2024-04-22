import { GenericObject } from "~/types/common";

export interface FetcherProps {
  endpoint: string;
  method: string;
  params?: GenericObject;
  data?: GenericObject;
  render: (data: any, isLoading: boolean, error: any) => JSX.Element;
}
