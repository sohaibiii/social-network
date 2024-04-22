import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import moment from "moment";
import { default as RNDatePicker } from "react-native-date-picker";
import { Text, useTheme } from "react-native-paper";
import { useDispatch } from "react-redux";

import { DatePickerContainerMode, DatePickerProps } from "./DatePicker.types";

import { Button, modalizeRef, TextInput } from "~/components/";
import datePickerStyle from "~/components/common/DatePicker/DatePicker.style";
import { APP_SCREEN_HEIGHT, HUMAN_READABLE_FORMAT } from "~/constants/";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import { translate } from "~/translations/";

const DatePicker = (props: DatePickerProps): JSX.Element => {
  const {
    initValue = moment(),
    handleDateSetCb,
    maxDate,
    minDate,
    doneButtonLabel = "Done",
    testID = "",
    label = translate("birthday"),
    mode = DatePickerContainerMode.LABEL,
    ...restOfProps
  } = props;

  const dispatch = useDispatch();
  const theme = useTheme();
  const { doneButtonLabelStyle, rnDatePickerStyle, container } = datePickerStyle;
  const [currentDateLabel, setCurrentDateLabel] = useState(
    moment(initValue).isValid()
      ? moment(initValue).locale("en").format(HUMAN_READABLE_FORMAT)
      : ""
  );

  let currentDate = moment(currentDateLabel);

  const handleDoneClicked = () => {
    const d = moment(currentDate).locale("en").format(HUMAN_READABLE_FORMAT);
    if (handleDateSetCb) {
      handleDateSetCb(currentDate.toDate());
    }
    setCurrentDateLabel(d);
    modalizeRef.current?.close();
  };

  const handleDateChanged = (date: Date) => {
    currentDate = moment(date);
  };

  const bottomSheetContent = () => {
    const initialDate = moment(currentDateLabel).locale("en").isValid()
      ? moment(moment(currentDateLabel).locale("en")).toDate()
      : moment().toDate();

    return (
      <View style={container}>
        <RNDatePicker
          date={initialDate}
          style={rnDatePickerStyle}
          onDateChange={handleDateChanged}
          maximumDate={maxDate}
          minimumDate={minDate}
          textColor={theme.colors.text}
          mode="date"
          locale="en"
          fadeToColor={theme.colors.background}
          testID={testID}
          {...restOfProps}
        />
        <Button
          onPress={handleDoneClicked}
          labelStyle={doneButtonLabelStyle}
          title={doneButtonLabel}
        />
      </View>
    );
  };

  const handleDateClicked = () => {
    dispatch(
      showBottomSheet({
        Content: bottomSheetContent,
        props: {
          modalHeight: APP_SCREEN_HEIGHT / 2
        },
        customProps: {
          flatListProps: null
        }
      })
    );
  };

  return (
    <View>
      <TouchableOpacity onPress={handleDateClicked}>
        {mode === DatePickerContainerMode.TEXT_INPUT ? (
          <View pointerEvents="none">
            <TextInput value={currentDateLabel} label={label} />
          </View>
        ) : (
          <Text>{currentDateLabel}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
export default DatePicker;
