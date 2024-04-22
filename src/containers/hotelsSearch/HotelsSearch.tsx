import React, { memo, useEffect, useState, useMemo, useCallback, useRef } from "react";
import {
  AppState,
  ImageBackground,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import moment, { Moment } from "moment";
import { useTranslation } from "react-i18next";
import { Appbar, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import { axiosHotelsInstance } from "../../apiServices/axiosService";

import { RootState } from "~/redux/store";

import { hotelsService } from "~/apiServices/index";
import IMAGES from "~/assets/images";
import {
  Button,
  Calendar,
  CalendarFooter,
  CText,
  GooglePlacesAutocomplete,
  Icon,
  IconTypes,
  modalizeRef
} from "~/components/";
import {
  GooglePlaceData,
  GooglePlaceDetail,
  Point
} from "~/components/common/GooglePlaces/GooglePlaces.types";
import { HotelExpiry } from "~/components/hotels";
import { RoomSelectorContent } from "~/components/hotelsSearch/RoomSelectorContent";
import { RoomSelectorType } from "~/components/hotelsSearch/RoomSelectorContent/RoomSelectorContent.types";
import { APP_SCREEN_HEIGHT, DEFAULTS, PLATFORM } from "~/constants/";
import { CURRENT_ENVIRONMENT } from "~/constants/constants";
import hotelsSearchStyles from "~/containers/hotelsSearch/HotelsSearch.styles";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import {
  setHotelsAccessToken,
  setHotelsPayload,
  setRooms,
  clearHotelsPayload,
  setCountOfNights,
  setHotelsSessionStartTimestamp,
  clearHotelsSessionStartTimestamp,
  setCalendarDates,
  setCalendarTempDates,
  clearHotelBooking
} from "~/redux/reducers/hotels.reducer";
import {
  CALENDAR_CLOSED,
  CALENDAR_OPENED,
  HOTELS_SEARCH_INITIAITED,
  HOTELS_SEARCH_SESSION_STARTED,
  logEvent,
  ROOMS_UPDATED,
  ROOM_SELECTOR_OPENED
} from "~/services/analytics";
import { EnvironmentTypes } from "~/types/common";
import { logError, Palestinianize, scale } from "~/utils/";

const ANALYTICS_SOURCE = "hotels_search";

const HotelSearch = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const isThemeDark = useSelector((state: RootState) => state.settings.isThemeDark);
  const language = useSelector((state: RootState) => state.settings.language);

  const checkin = useSelector((state: RootState) => state.hotels.calendarPayload.checkin);
  const checkout = useSelector(
    (state: RootState) => state.hotels.calendarPayload.checkout
  );
  const roomsDetails = useSelector(
    (state: RootState) => state.hotels.hotelsPayload.occupancy.rooms
  ) || [
    {
      adults: 1,
      children: 0,
      childrenAges: []
    }
  ];
  const hotelsSessionStartTimestamp = useSelector(
    (state: RootState) => state.hotels.hotelsSessionStartTimestamp
  );

  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState<Point>();
  const [isVisible, setIsVisible] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout>();
  const appState = useRef(AppState.currentState);

  const insets = useSafeAreaInsets();

  const { HOTEL_SEARCH_CONSTANTS } =
    CURRENT_ENVIRONMENT === EnvironmentTypes.STAGE
      ? require("~/constants/hotels.stage")
      : CURRENT_ENVIRONMENT === EnvironmentTypes.PRODUCTION
      ? require("~/constants/hotels.production")
      : require("~/constants/hotels.dev");

  const {
    containerStyle,
    iconStyle,
    calendarSeparatorStyle,
    cardStyle,
    bookingDetailsContainerStyle,
    buttonStyle,
    disabledButtonStyle,
    calendarRow,
    backArrowStyle,
    titleTextStyle,
    backgroundImageStyle,
    flex,
    row,
    whiteLabel,
    contentContainerStyle,
    calendarContainerStyle,
    scrollViewStyle,
    searchTextStyle,
    dateStyle,
    headerStyle
  } = useMemo(
    () => hotelsSearchStyles(colors, !!isThemeDark, insets),
    [colors, insets, isThemeDark]
  );

  const CalendarCard = ({ time }: { time: Moment }) => (
    <View style={calendarRow}>
      <Icon
        name="calendar"
        width={scale(18)}
        height={scale(18)}
        style={iconStyle}
        color={colors.text}
        type={IconTypes.SAFARWAY_ICONS}
      />
      <CText style={dateStyle} numberOfLines={1} fontSize={12} lineHeight={18}>
        {moment(time).locale(language).format("dddd, ")}
        {moment(time).locale("en").format("D")}
        {moment(time).locale(language).format(" MMM")}
      </CText>
    </View>
  );

  const handleGooglePlaceClicked = (
    data: GooglePlaceData,
    details: GooglePlaceDetail | null
  ) => {
    modalizeRef.current?.close();

    setPosition({
      lat: details?.geometry.location.lat || 0,
      lng: details?.geometry.location.lng || 0
    });
    const PalestinianizedAddress = Palestinianize(details?.formatted_address || "");
    setSearch(PalestinianizedAddress);
  };

  const renderSearchContent = () => (
    <View style={calendarContainerStyle}>
      <ScrollView
        horizontal
        style={scrollViewStyle}
        contentContainerStyle={contentContainerStyle}
        scrollEnabled={false}
        bounces={false}
        keyboardShouldPersistTaps={"always"}
      >
        <GooglePlacesAutocomplete
          keepResultsAfterBlur={true}
          hasCurrentLocation={false}
          keyboardShouldPersistTaps={"always"}
          googlePlaceClickedCb={handleGooglePlaceClicked}
          analyticsSource={ANALYTICS_SOURCE}
        />
      </ScrollView>
    </View>
  );

  const showSearchSheet = () => {
    dispatch(
      showBottomSheet({
        Content: renderSearchContent,
        props: {
          modalBackgroundColor: colors.background,
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
  };

  let tempCheckin = moment(checkin) ?? moment();
  let tempCheckout = moment(checkout) ?? moment().add(1, "day");

  const handleSelectDate = range => {
    const { startDate, endDate } = range || {};

    dispatch(
      setCalendarTempDates({
        tempCheckin: startDate,
        tempCheckout: endDate
      })
    );

    if (startDate === endDate || !endDate) {
      tempCheckin = moment(startDate);
      tempCheckout = moment(startDate).add(1, "day");
      dispatch(setCountOfNights(0));
      return;
    }
    tempCheckin = moment(startDate);
    tempCheckout = moment(endDate);
    const countOfNights = tempCheckout.diff(tempCheckin, "days");
    dispatch(setCountOfNights(countOfNights));
  };

  const handleDateSaved = useCallback(() => {
    modalizeRef.current?.close();
    if (tempCheckin.isSameOrAfter(tempCheckout)) {
      dispatch(
        setCalendarDates({
          checkin: tempCheckin,
          checkout: moment(tempCheckin).add(1, "day")
        })
      );

      return;
    }
    if (tempCheckout.diff(tempCheckin, "days") === 1) {
      dispatch(
        setCalendarTempDates({
          tempCheckin: tempCheckin,
          tempCheckout: tempCheckout
        })
      );
      dispatch(setCountOfNights(1));
    }

    dispatch(
      setCalendarDates({
        checkin: tempCheckin,
        checkout: tempCheckout
      })
    );
    return logEvent(CALENDAR_CLOSED, { source: ANALYTICS_SOURCE });
  }, [dispatch, tempCheckin, tempCheckout]);

  const renderCalendarContent = () => {
    const startMonth = Math.floor(
      Math.abs(moment(checkin).diff(moment(), "months", true))
    );

    return <Calendar onChangeCb={handleSelectDate} startIndex={startMonth} />;
  };

  const renderCalendarFooter = () => <CalendarFooter onPressCb={handleDateSaved} />;
  const handleOnDismissCalendar = () => {
    tempCheckin = checkin;
    tempCheckout = checkout;

    dispatch(
      setCalendarTempDates({
        tempCheckin: checkin,
        tempCheckout: checkout
      })
    );
  };

  const showCalendarSheet = () => {
    dispatch(
      showBottomSheet({
        Content: renderCalendarContent,
        props: {
          style: {
            marginTop: APP_SCREEN_HEIGHT * 0.15 + StatusBar?.currentHeight
          },
          hideModalContentWhileAnimating: true,
          modalBackgroundColor: colors.primaryBackground,
          FooterComponent: renderCalendarFooter,
          hasScrollableView: true,
          onDismissCb: handleOnDismissCalendar
        }
      })
    );
    return logEvent(CALENDAR_OPENED, { source: ANALYTICS_SOURCE });
  };

  const handleOnDonePressed = useCallback(
    data => {
      dispatch(setRooms({ rooms: data }));
      modalizeRef.current?.close();
      return logEvent(ROOMS_UPDATED, {
        source: ANALYTICS_SOURCE,
        selected_rooms_data: data
      });
    },
    [dispatch]
  );

  const renderRoomSelectorContent = () => (
    <RoomSelectorContent onPressCb={handleOnDonePressed} />
  );

  const showRoomSelectorSheet = () => {
    dispatch(
      showBottomSheet({
        Content: renderRoomSelectorContent,
        props: {
          flatListProps: null,
          scrollViewProps: {
            scrollEnabled: true,
            keyboardShouldPersistTaps: "handled"
          }
        }
      })
    );
    return logEvent(ROOM_SELECTOR_OPENED, {
      source: ANALYTICS_SOURCE
    });
  };

  const adultsCount = roomsDetails?.reduce(
    (prev: number, current: RoomSelectorType) => prev + current.adults,
    0
  );
  const childrenCount = roomsDetails?.reduce(
    (prev: number, current: RoomSelectorType) => prev + current.children,
    0
  );

  const handleSearchForHotels = async () => {
    setIsLoading(true);

    const {
      radius,
      leaderNationality,
      language,
      timeout,
      sellingChannel,
      availableOnly
    } = HOTEL_SEARCH_CONSTANTS;

    try {
      const params = {
        destination: {
          geofence: {
            latitude: position?.lat || 0,
            longitude: position?.lng || 0,
            radius
          }
        },
        checkIn: moment(checkin).locale("en").format("Y-MM-DD"),
        checkOut: moment(checkout).locale("en").format("Y-MM-DD"),
        occupancy: {
          leaderNationality,
          rooms: roomsDetails
        },
        countOfNights: moment(checkout).diff(moment(checkin), "days"),
        language,
        timeout,
        sellingChannel,
        availableOnly
      };

      await logEvent(HOTELS_SEARCH_INITIAITED, {
        source: ANALYTICS_SOURCE,
        search_text: search,
        ...params
      });
      dispatch(setHotelsPayload(params));
      dispatch(setHotelsSessionStartTimestamp(moment()));
      navigation.navigate("HotelsListView", {
        searchTerm: search,
        position
      });
    } catch (error) {
      logError(`Error: handleSearchForHotels --HotelsSearch.tsx-- ${error} `);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const { access_token } = await hotelsService.getAccessToken();
        dispatch(setHotelsAccessToken(access_token));
        axiosHotelsInstance.defaults.headers.common.authorization = `${access_token}`;

        await logEvent(HOTELS_SEARCH_SESSION_STARTED, { source: ANALYTICS_SOURCE });
      } catch (error) {
        logError(`Error: getAccessToken --HotelsSearch.tsx-- ${error} `);
      }
    };

    getAccessToken();

    return () => {
      dispatch(clearHotelsPayload());
      dispatch(clearHotelBooking());
      dispatch(clearHotelsSessionStartTimestamp());
    };
  }, []);

  useEffect(() => {
    if (!hotelsSessionStartTimestamp) {
      return;
    }

    const timeoutDurationInMilleseconds = DEFAULTS.HOTEL_SESSION_TIMEOUT * 60 * 1000;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, timeoutDurationInMilleseconds);

    if (PLATFORM === "ios") {
      return;
    }
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        clearTimeout(timeoutRef.current);
        const endTime = moment(hotelsSessionStartTimestamp).add(
          DEFAULTS.HOTEL_SESSION_TIMEOUT * 60 * 1000
        );

        const remainingTime = endTime.diff(moment(), "milliseconds");
        timeoutRef.current = setTimeout(() => {
          setIsVisible(true);
        }, remainingTime);
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [hotelsSessionStartTimestamp]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const occupantsText = useMemo(
    () =>
      `${t("hotels.adults_humanized", {
        count: adultsCount
      })}${childrenCount > 0 ? "," : ""} ${t("hotels.children_humanized", {
        count: childrenCount,
        context: `${childrenCount}`
      })}`,
    [adultsCount, childrenCount, t]
  );

  return (
    <>
      <HotelExpiry visibleFlag={isVisible} />

      <ImageBackground
        style={flex}
        imageStyle={backgroundImageStyle}
        source={IMAGES.hotel_search_bg}
      >
        <View style={flex}>
          <View style={headerStyle}>
            <Appbar.BackAction
              style={backArrowStyle}
              color={"white"}
              size={scale(20)}
              onPress={navigation.goBack}
            />
            <CText color={"white"} textAlign={"center"}>
              {t("hotels.title")}
            </CText>
          </View>
          <View style={containerStyle}>
            <CText style={titleTextStyle} fontSize={20} lineHeight={25} color="white">
              {t("hotels.intro")}
            </CText>
            <TouchableOpacity onPress={showSearchSheet} style={cardStyle}>
              <View style={row}>
                <Icon
                  name="hotel"
                  size={scale(16)}
                  style={iconStyle}
                  color={colors.text}
                  type={IconTypes.FONTISTO}
                />
                <CText
                  style={searchTextStyle}
                  numberOfLines={1}
                  ellipsizeMode={"head"}
                  color={search ? "text" : "gray"}
                  fontSize={12}
                  lineHeight={18}
                >
                  {search || t("hotels.searchForHotelsCities")}
                </CText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={showCalendarSheet} style={cardStyle}>
              <View style={calendarSeparatorStyle} />
              <CalendarCard time={checkin} />
              <CalendarCard time={checkout} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={showRoomSelectorSheet}
              style={bookingDetailsContainerStyle}
            >
              <Icon
                name="person-outline"
                size={scale(18)}
                style={iconStyle}
                color={colors.text}
                type={IconTypes.MATERIAL_ICONS}
              />
              <CText fontSize={12} lineHeight={15}>
                {occupantsText}
              </CText>
            </TouchableOpacity>
            <Button
              disabled={!position}
              onPress={handleSearchForHotels}
              isLoading={isLoading}
              labelStyle={whiteLabel}
              style={!position ? disabledButtonStyle : buttonStyle}
              title={t("search")}
            />
          </View>
        </View>
      </ImageBackground>
    </>
  );
};

export default memo(HotelSearch);
