import React from "react";
import { Pressable, Text, View } from "react-native";

import moment from "moment";
import { useTheme } from "react-native-paper";
import { shallowEqual, useSelector } from "react-redux";

import { dayStyle } from "./Calendar.style";
import { DayProps } from "./Calendar.types";

import { RootState } from "~/redux/store";

const Day = (props: DayProps): JSX.Element => {
  const { id, onChangeCb, month, year, week, day, minDate } = props;
  const currentDate = moment(`${year}-${month + 1}-${day}`);
  const start = useSelector(
    (state: RootState) => state.hotels.calendarPayload.tempCheckin,
    shallowEqual
  );
  const end = useSelector(
    (state: RootState) => state.hotels.calendarPayload.tempCheckout,
    shallowEqual
  );
  const isThemeDark = useSelector(
    (reduxState: RootState) => reduxState.settings.isThemeDark
  );

  const currentMoment = minDate
    ? moment(minDate).subtract(1, "days")
    : moment().subtract(1, "days");
  const startMoment = moment(start);
  const endMoment = moment(end);
  const dayMoment = moment(id);
  const starting = currentDate.isSame(startMoment);
  const isBetween = currentDate?.isBetween(startMoment, endMoment);
  const ending = currentDate.isSame(endMoment);
  const isDayDisabled = dayMoment.isBefore(currentMoment);

  const { colors } = useTheme();

  const handleOnPress = () => {
    if (start) {
      if (!end && !start.isSameOrAfter(dayMoment)) {
        onChangeCb({
          startDate: start,
          endDate: dayMoment
        });
      } else {
        onChangeCb({
          startDate: dayMoment,
          endDate: null
        });
      }
    } else {
      onChangeCb({
        startDate: dayMoment,
        endDate: null
      });
    }
  };

  const isExtraDays = (weekDay: number, currentDay: number | string) => {
    if (weekDay === 0 && currentDay > 10) {
      return true;
    } else if (weekDay === 5 && currentDay < 10) {
      return true;
    } else return weekDay === 4 && currentDay < 10;
  };

  const {
    nothingContainerStyle,
    startingContainerStyle,
    betweenContainerStyle,
    startingWithEndContainerStyle,
    endContainerStyle,
    endingContainerStyle,
    emptyDay,
    dayTextStyle,
    selectedDayTextStyle,
    startSelectedDayTextStyle,
    endSelectedDayTextStyle,
    disabledTextStyle
  } = dayStyle(colors, isThemeDark);

  if (isExtraDays(week, day)) {
    return <View key={`${id}-disabled`} style={emptyDay} />;
  }

  const dayStyles = isDayDisabled
    ? disabledTextStyle
    : starting && !end
    ? startSelectedDayTextStyle
    : starting
    ? startSelectedDayTextStyle
    : isBetween
    ? selectedDayTextStyle
    : !end && ending
    ? endSelectedDayTextStyle
    : ending
    ? endSelectedDayTextStyle
    : dayTextStyle;

  const containerStyle =
    starting && !end
      ? startingWithEndContainerStyle
      : starting
      ? startingContainerStyle
      : isBetween
      ? betweenContainerStyle
      : !end && ending
      ? endContainerStyle
      : ending
      ? endingContainerStyle
      : nothingContainerStyle;

  return (
    <Pressable disabled={isDayDisabled} style={containerStyle} onPress={handleOnPress}>
      <Text style={dayStyles}>{day}</Text>
    </Pressable>
  );
};
export default Day;
