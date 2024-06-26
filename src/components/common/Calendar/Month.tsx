import React, { memo, useEffect, useMemo, useState } from "react";
import { View } from "react-native";

import moment from "moment";
import isEqual from "react-fast-compare";

import { monthStyle } from "./Calendar.style";
import { MonthProps } from "./Calendar.types";

import Day from "~/components/common/Calendar/Day";

const Month = (props: MonthProps): JSX.Element => {
  const { year, month, onChangeCb, minDate } = props;
  const [calendar, setCalendar] = useState<string[][]>([]);

  const { containerStyle } = useMemo(() => monthStyle, []);

  useEffect(() => {
    const tempCalendar = [];
    const startDate = moment([year, month]).locale("en").startOf("month").startOf("week");

    const endDate = moment([year, month]).locale("en").endOf("month");

    const day = startDate.subtract(1, "day");

    while (day.isBefore(endDate, "day")) {
      tempCalendar.push(
        Array(7)
          .fill(0)
          .map(() => day.add(1, "day").locale("en").format("DD"))
      );
    }
    setCalendar(tempCalendar);
  }, []);

  return (
    <>
      {calendar?.map((week, index) => (
        <View style={containerStyle} key={`week-${month}-${week[0]}-${index}`}>
          {week.map(currentDay => {
            return (
              <Day
                key={`${year}-${month + 1}-${currentDay}`}
                id={`${year}-${month + 1}-${currentDay}`}
                day={currentDay}
                week={index}
                onChangeCb={onChangeCb}
                year={year}
                month={month}
                minDate={minDate}
              />
            );
          })}
        </View>
      ))}
    </>
  );
};
export default memo(Month, isEqual);
