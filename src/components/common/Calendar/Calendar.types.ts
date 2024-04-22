import { Moment } from "moment";

interface CalendarInterface {
  monthHeight?: number;
  monthsCount?: number;
  startIndex?: number;
  minDate?: Moment;
  onChangeCb?: ({
    startDate,
    endDate
  }: {
    startDate: Moment;
    endDate: Moment | null;
  }) => void;
}
export type CalendarTypes = CalendarInterface;

export type DayProps = {
  id: string;
  onChangeCb: ({
    startDate,
    endDate
  }: {
    startDate: Moment;
    endDate: Moment | null;
  }) => void;
  month: number;
  year: number;
  week: number;
  day: number | string;
  minDate?: Moment;
};

export type MonthProps = {
  year: number;
  month: number;
  minDate?: Moment;
  onChangeCb: ({
    startDate,
    endDate
  }: {
    startDate: Moment;
    endDate: Moment | null;
  }) => void;
};
