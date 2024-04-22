import React, { memo, useCallback, useRef } from "react";
import { StatusBar, TouchableOpacity, View } from "react-native";

import moment from "moment";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import styles from "./HotelsSearchAgain.styles";
import { HotelsSearchAgainProps } from "./HotelsSearchAgain.types";

import { RootState } from "~/redux/store";

import {
  Calendar,
  CalendarFooter,
  CText,
  Icon,
  IconTypes,
  RoomSelectorContent
} from "~/components/";
import { RoomSelectorType } from "~/components/hotelsSearch/RoomSelectorContent/RoomSelectorContent.types";
import { APP_SCREEN_HEIGHT, PLATFORM } from "~/constants/";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import { setCalendarTempDates, setCountOfNights } from "~/redux/reducers/hotels.reducer";
import { CALENDAR_OPENED, logEvent, ROOM_SELECTOR_OPENED } from "~/services/analytics";
import { scale } from "~/utils/";

const HotelsSearchAgain = (props: HotelsSearchAgainProps) => {
  const {
    handleDateSaved = () => undefined,
    handleRoomSelected = () => undefined,
    analyticsSource = ""
  } = props;

  const checkin = useSelector((state: RootState) => state.hotels.calendarPayload.checkin);
  const checkout = useSelector(
    (state: RootState) => state.hotels.calendarPayload.checkout
  );
  const language = useSelector((state: RootState) => state.settings.language);

  const isThemeDark = useSelector(
    (reduxState: RootState) => reduxState.settings.isThemeDark
  );

  const tempCheckin = useRef(checkin);
  const tempCheckout = useRef(checkout);

  const searchAgainColors = isThemeDark ? "white" : "primary_reversed";
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const { iconTextWithFlexContainer, filtersContainer, iconStyle, iconTextContainer } =
    styles(colors);

  const roomsDetails = useSelector(
    (state: RootState) => state.hotels.hotelsPayload.occupancy.rooms
  ) || [
    {
      adults: 1,
      children: 0,
      childrenAges: []
    }
  ];

  const adultsCount = roomsDetails?.reduce(
    (prev: number, current: RoomSelectorType) => prev + current.adults,
    0
  );
  const childrenCount = roomsDetails?.reduce(
    (prev: number, current: RoomSelectorType) => prev + current.children,
    0
  );

  const handleSelectDate = useCallback(
    range => {
      const { startDate, endDate } = range || {};
      dispatch(
        setCalendarTempDates({
          tempCheckin: startDate,
          tempCheckout: endDate
        })
      );

      if (startDate === endDate || !endDate) {
        tempCheckin.current = moment(startDate);
        tempCheckout.current = moment(startDate).add(1, "day");
        dispatch(setCountOfNights(0));
        return;
      }
      tempCheckin.current = moment(startDate);
      tempCheckout.current = moment(endDate);
      const countOfNights = tempCheckout.current.diff(tempCheckin.current, "days");
      dispatch(setCountOfNights(countOfNights));
    },
    [dispatch]
  );

  const renderCalendarContent = useCallback(() => {
    return <Calendar onChangeCb={handleSelectDate} />;
  }, [handleSelectDate]);

  const handleDonePressed = useCallback(() => {
    handleDateSaved(tempCheckin.current.locale("en"), tempCheckout.current.locale("en"));
  }, [handleDateSaved, tempCheckin, tempCheckout]);

  const renderCalendarFooter = useCallback(
    () => <CalendarFooter onPressCb={handleDonePressed} />,
    [handleDonePressed]
  );

  const handleOnDismissCalendar = useCallback(() => {
    tempCheckin.current = checkin;
    tempCheckout.current = checkout;
    dispatch(
      setCalendarTempDates({
        tempCheckin: checkin,
        tempCheckout: checkout
      })
    );
  }, [checkin, checkout, dispatch]);

  const handleCalendarPressed = useCallback(() => {
    dispatch(
      showBottomSheet({
        Content: renderCalendarContent,
        props: {
          style: {
            marginTop: APP_SCREEN_HEIGHT * 0.15 + StatusBar?.currentHeight
          },
          modalBackgroundColor: colors.background,
          FooterComponent: renderCalendarFooter,
          onDismissCb: handleOnDismissCalendar
        }
      })
    );
    return logEvent(CALENDAR_OPENED, { source: analyticsSource });
  }, [
    dispatch,
    renderCalendarContent,
    colors.background,
    renderCalendarFooter,
    handleOnDismissCalendar,
    analyticsSource
  ]);

  const renderRoomSelectorContent = useCallback(
    () => <RoomSelectorContent onPressCb={handleRoomSelected} />,
    [handleRoomSelected]
  );

  const handleRoomsPressed = useCallback(() => {
    dispatch(
      showBottomSheet({
        Content: renderRoomSelectorContent,
        props: {
          modalBackgroundColor: colors.surface,
          flatListProps: null,
          scrollViewProps: {
            keyboardShouldPersistTaps: "always"
          },
          HeaderComponent: null,
          shouldKeyboardDismiss: false,
          keyboardAvoidingBehavior: PLATFORM === "ios" ? "padding" : null
        }
      })
    );
    return logEvent(ROOM_SELECTOR_OPENED, { source: analyticsSource });
  }, [colors.surface, dispatch, renderRoomSelectorContent]);

  return (
    <View style={filtersContainer}>
      <TouchableOpacity style={iconTextWithFlexContainer} onPress={handleCalendarPressed}>
        <Icon
          name="calendar"
          width={scale(16)}
          height={scale(16)}
          style={iconStyle}
          color={colors[searchAgainColors]}
          type={IconTypes.SAFARWAY_ICONS}
        />
        <CText fontSize={13} lineHeight={18} color={searchAgainColors}>
          {`${moment(checkin).locale("en").format("D")} ${moment(checkin)
            .locale(language)
            .format("MMM")} - ${moment(checkout).locale("en").format("D")} ${moment(
            checkout
          )
            .locale(language)
            .format("MMM")} ${moment(checkout).locale("en").format("YYYY")}, ${t(
            "hotels.nights_humanized",
            {
              count: Math.round(moment(checkout).diff(moment(checkin), "days", true))
            }
          )}`}
        </CText>
      </TouchableOpacity>
      <TouchableOpacity style={iconTextContainer} onPress={handleRoomsPressed}>
        <Icon
          name="bed-outline"
          size={scale(16)}
          style={iconStyle}
          color={colors[searchAgainColors]}
          type={IconTypes.MATERIAL_COMMUNITY_ICONS}
        />
        <CText fontSize={13} lineHeight={18} color={searchAgainColors}>
          {roomsDetails?.length}
        </CText>
        <Icon
          name="person-outline"
          size={scale(16)}
          style={iconStyle}
          color={colors[searchAgainColors]}
          type={IconTypes.MATERIAL_ICONS}
        />
        <CText fontSize={13} lineHeight={18} color={searchAgainColors}>
          {adultsCount + childrenCount}
        </CText>
      </TouchableOpacity>
    </View>
  );
};

export default memo(HotelsSearchAgain);
