import React, { memo, useCallback, useMemo } from "react";
import { Pressable, View } from "react-native";

import moment, { Moment } from "moment";
import isEqual from "react-fast-compare";
import { FlatList } from "react-native-gesture-handler";

import "moment/min/locales";

import calendarStyle from "./Calendar.style";
import { CalendarTypes } from "./Calendar.types";

import { CText } from "~/components/";
import Month from "~/components/common/Calendar/Month";
import { moderateScale } from "~/utils/";

const Calendar = (props: CalendarTypes): JSX.Element => {
  const {
    onChangeCb = () => undefined,
    monthHeight = moderateScale(300),
    monthsCount = 12,
    startIndex = 0,
    minDate
  } = props || {};

  const months: Moment[] = Array.from({ length: monthsCount }, (_, id) =>
    moment().add(id, "months")
  );

  const { containerStyle, monthNameContainerStyle, monthTextStyle, monthNameStyle } =
    useMemo(() => calendarStyle(monthHeight), [monthHeight]);

  const renderMonths = useCallback(
    ({ item }: { item: Moment }) => (
      <Pressable style={containerStyle}>
        <CText textAlign={"center"} style={monthTextStyle} fontSize={15}>
          {`${item.format("MMMM")} ${item.clone().locale("en").format("YYYY")}`}
        </CText>
        <View style={monthNameContainerStyle}>
          {moment.weekdaysShort().map(title => (
            <CText
              fontSize={12}
              color={"primary_reversed"}
              style={monthNameStyle}
              key={title}
            >
              {title}
            </CText>
          ))}
        </View>
        <Month
          onChangeCb={onChangeCb}
          month={item.get("month")}
          year={item.get("year")}
          minDate={minDate}
        />
      </Pressable>
    ),
    [
      containerStyle,
      monthNameContainerStyle,
      monthNameStyle,
      monthTextStyle,
      onChangeCb,
      minDate
    ]
  );

  const getItemLayout = useCallback(
    (i: Moment[] | null | undefined, index: number) => {
      return {
        index,
        length: monthHeight,
        offset: index * monthHeight
      };
    },
    [monthHeight]
  );

  const keyExtractor = useCallback(item => `${item.format("MMMM-YYYY")}`, []);

  return (
    <FlatList
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      renderItem={renderMonths}
      data={months}
      initialScrollIndex={startIndex}
    />
  );
};
export default memo(Calendar, isEqual);
