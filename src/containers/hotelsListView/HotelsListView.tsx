import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  LayoutAnimation,
  RefreshControl,
  TouchableOpacity,
  View
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import moment from "moment";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Appbar, ProgressBar, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import hotelsListViewStyles from "./HotelsListView.styles";

import { RootState } from "~/redux/store";

import { Hotel, HotelProgressStatus } from "~/apiServices/hotels/hotels.types";
import { hotelsService } from "~/apiServices/index";
import LOTTIE from "~/assets/lottie";
import { Button, CText, Icon, IconTypes, modalizeRef } from "~/components/";
import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import { FiltersPanelContent } from "~/components/hotels";
import { HotelsSearchAgain } from "~/components/hotels/hotelsSearchAgain";
import { HotelsListCard, HotelsListCardSkeleton } from "~/components/hotelsList";
import { APP_SCREEN_HEIGHT, MOMENT_YYY_MM_DD } from "~/constants/";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import {
  setHotelsTokens,
  setHotelsSRK,
  setRooms,
  setCalendarDates,
  setCalendarTempDates,
  setCountOfNights,
  setHotelsSessionStartTimestamp
} from "~/redux/reducers/hotels.reducer";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import { AppStackRoutesHotelsListProps } from "~/router/AppStackRoutes/AppStackRoutes.type";
import {
  HOTELS_SEARCH_FAILED,
  HOTELS_SEARCH_MORE_RESULTS_LOADED,
  HOTELS_SEARCH_NO_RESULTS,
  HOTELS_SEARCH_RESULTS_SCREEN_LOADED,
  HOTELS_SEARCH_SUCCESS,
  logEvent,
  MAP_VIEW_PRESSED,
  SEARCH_FILTERS_PRESSED,
  HOTELS_SEARCH_RESULTS_RETRIEVED,
  HOTEL_SELECTED,
  CALENDAR_CLOSED,
  ROOMS_UPDATED
} from "~/services/analytics";
import { translate } from "~/translations/";
import { logError, moderateScale, scale } from "~/utils/";

const LIMIT = 10;
const ANALYTICS_SOURCE = "hotels_results_page";

const HotelsListView = (props: AppStackRoutesHotelsListProps): JSX.Element => {
  const { route } = props;
  const { params } = route;
  const { searchTerm, position } = params;
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const offset = useRef(1);
  const [filters, setFilters] = useState({});

  const hasReachedEnd = useRef(true);
  const isFirstLoad = useRef(true);
  const [progress, setProgress] = useState(0);

  const payload = useSelector(
    (state: RootState) => state.hotels.hotelsPayload,
    shallowEqual
  );
  const calendarPayload = useSelector(
    (state: RootState) => state.hotels.calendarPayload,
    shallowEqual
  );
  const srk = useSelector((state: RootState) => state.hotels.srk, shallowEqual);
  const accessToken = useSelector(
    (state: RootState) => state.hotels.accessToken,
    shallowEqual
  );
  const resultsToken = useSelector(
    (state: RootState) => state.hotels.resultsToken,
    shallowEqual
  );
  const isThemeDark = useSelector(
    (reduxState: RootState) => reduxState.settings.isThemeDark
  );

  const insets = useSafeAreaInsets();

  const {
    flex,
    headerStyle,
    contentContainerStyle,
    flatlistStyle,
    whiteLabel,
    notFoundLottieStyle,
    settingsSelectorContainer,
    footerContainerStyle,
    loadingContainerStyle,
    loadingTextStyle,
    loadingBackgroundStyle,
    filtersTextStyle,
    filtersSpacingStyle,
    iconStyle,
    buttonsWrapperStyle,
    buttonsContainerStyle,
    progressContainerStyle,
    progressStyle,
    greyBackgroundStyle,
    titleStyle,
    buttonStyle
  } = useMemo(
    () => hotelsListViewStyles(colors, insets, isThemeDark),
    [colors, insets, isThemeDark]
  );

  const getHotels = useCallback(
    (
      pageParam = 1,
      srkParam = srk,
      resultsTokenParam = resultsToken,
      accessTokenParam = accessToken,
      hotelFilters = filters
    ) => {
      hotelsService
        .resultsHotelsSearch(srkParam, resultsTokenParam, hotelFilters, pageParam, LIMIT)
        .then(results => {
          const newHotelsLength = results.hotels.length;
          hasReachedEnd.current = newHotelsLength === 0 || newHotelsLength !== LIMIT;
          if (newHotelsLength === 0) {
            return logEvent(HOTELS_SEARCH_NO_RESULTS, {
              source: ANALYTICS_SOURCE,
              search_filter: hotelFilters,
              search_text: searchTerm,
              ...payload
            });
          }
          setHotels(prevState =>
            pageParam === 1 ? results.hotels : [...prevState, ...results.hotels]
          );

          let extraEventParams = {};
          let eventName = HOTELS_SEARCH_RESULTS_RETRIEVED;
          if (Object.keys(hotelFilters).length > 0) {
            extraEventParams = {
              search_filters: hotelFilters
            };
            eventName = `${eventName}_and_filtered`;
          }
          return logEvent(eventName, {
            source: ANALYTICS_SOURCE,
            hotels_count: results?.hotels?.length,
            ...extraEventParams,
            ...payload
          });
        })
        .catch(error => {
          dispatch(
            showSnackbar({
              text: translate("something_went_wrong"),
              type: SnackbarVariations.TOAST,
              duration: 2000,
              backgroundColor: colors.darkRed
            })
          );
          logError(
            `Error: resultsHotelsSearch --HotelsListView.tsx-- srk=${srkParam} resultsToken=${resultsTokenParam} accessToken=${accessTokenParam} ${error}`
          );
        })
        .finally(() => {
          setIsLoading(false);
          setIsRefreshing(false);
        });
    },
    [accessToken, colors.darkRed, dispatch, filters, resultsToken, srk]
  );

  const initializeHotels = useCallback((payloadParam = payload) => {
    hotelsService
      .searchHotels(payloadParam)
      .then(async searchRes => {
        dispatch(setHotelsSessionStartTimestamp(moment()));
        dispatch(
          setHotelsTokens({
            asyncToken: searchRes.tokens.async,
            resultsToken: searchRes.tokens.results,
            progressToken: searchRes.tokens.progress
          })
        );
        let stopped = false;
        let finalProgressResult = {};
        // infinite loop
        while (!stopped) {
          const progressResult = await hotelsService.progressHotelsSearch(
            searchRes.tokens.progress
          );
          if (progressResult.status === HotelProgressStatus.COMPLETED) {
            stopped = true;
            finalProgressResult = progressResult;
            setProgress(100);
            await dispatch(setHotelsSRK(progressResult.srk));
            await logEvent(HOTELS_SEARCH_SUCCESS, {
              source: ANALYTICS_SOURCE,
              offers_count: progressResult?.countOffers,
              hotels_count: progressResult?.countHotels,
              ...payloadParam
            });
            getHotels(1, progressResult.srk, searchRes.tokens.results, accessToken);
          }
          setProgress(prevState =>
            Math.min(Math.floor(Math.random() * 11 + 10) + 1 + prevState, 100)
          );
        }

        return finalProgressResult;
      })
      .catch(error => {
        dispatch(
          showSnackbar({
            text: translate("something_went_wrong"),
            type: SnackbarVariations.TOAST,
            duration: 2000,
            backgroundColor: colors.darkRed
          })
        );
        logError(
          `Error: searchHotels --HotelsListView.tsx-- resultsToken=${resultsToken} accessToken=${accessToken} ${error}`
        );
        setIsLoading(false);
        setIsRefreshing(false);

        return logEvent(HOTELS_SEARCH_FAILED, {
          source: ANALYTICS_SOURCE,
          search_filter: hotelFilters,
          ...payloadParam
        });
      })
      .finally(() => {
        isFirstLoad.current = false;
      });
  }, []);

  useEffect(() => {
    const handleOnPageLoaded = () =>
      logEvent(HOTELS_SEARCH_RESULTS_SCREEN_LOADED, { source: ANALYTICS_SOURCE });

    handleOnPageLoaded();
    initializeHotels();
  }, []);

  /** this use effect listen to changes in payload check-in check-out and occupancy rooms
   * once they change it reintialize Hotel search with new params
   * this way when changing rooms from hotel details and go back to listview/map it is updated
   *  ref https://safarway.atlassian.net/browse/SAF-4193
   */

  const handleOnRefresh = useCallback(() => {
    if (isLoading) {
      return;
    }
    setIsRefreshing(true);
    offset.current = 1;
    setHotels([]);
    getHotels(1);
  }, [getHotels, isLoading]);

  const renderFooter = useCallback(() => {
    if (!isLoading && !isRefreshing) {
      return null;
    }
    return (
      <>
        <HotelsListCardSkeleton />
        <HotelsListCardSkeleton />
        <HotelsListCardSkeleton />
        <HotelsListCardSkeleton />
      </>
    );
  }, [isLoading, isRefreshing]);

  const handleOnEndReached = useCallback(async () => {
    if (isLoading || isRefreshing || hasReachedEnd.current) {
      return;
    }
    offset.current += 1;
    const nextPage = offset.current;
    setIsLoading(true);
    getHotels(nextPage);
    await logEvent(HOTELS_SEARCH_MORE_RESULTS_LOADED, {
      source: ANALYTICS_SOURCE,
      next_page: nextPage
    });
  }, [isLoading, isRefreshing, offset, getHotels, hasReachedEnd]);

  const keyExtractor = useCallback(item => item.index, []);

  const renderListEmptyComponent = useCallback(() => {
    if (isLoading || isRefreshing) {
      return (
        <View>
          <HotelsListCardSkeleton />
          <HotelsListCardSkeleton />
          <HotelsListCardSkeleton />
          <HotelsListCardSkeleton />
        </View>
      );
    }

    return (
      <View>
        <LottieView source={LOTTIE.not_found} autoPlay loop style={notFoundLottieStyle} />
        <CText textAlign={"center"}>{t("hotels.not_found")}</CText>
      </View>
    );
  }, [isLoading, isRefreshing, notFoundLottieStyle, t]);

  const { control, setValue, handleSubmit, getValues } = useForm({
    mode: "onSubmit"
  });

  const orderValue = getValues("order");

  const handleFiltersApplied = useCallback(
    data => {
      modalizeRef.current?.close();
      const {
        hotel_facilities = [],
        room_facilities = [],
        price,
        category,
        name,
        basis,
        order: orderFormik,
        type = []
      } = data;

      let sortField;
      let sortOrder;
      switch (orderFormik) {
        case "1":
          sortField = "price";
          sortOrder = "ASC";
          break;
        case "2":
          sortField = "price";
          sortOrder = "DESC";
          break;
        case "3":
          sortField = "stars";
          sortOrder = "ASC";
          break;
        case "4":
          sortField = "stars";
          sortOrder = "DESC";
          break;
        case "5":
          sortField = "name";
          sortOrder = "ASC";
          break;
        case "6":
          sortField = "name";
          sortOrder = "DESC";
          break;
      }
      const hotelFilters = {
        hotelName: name?.substr(0, 50),
        "priceRange[min]": price[0],
        "priceRange[max]": price[1],
        "priceRange[currency]": "USD",
        sortField,
        sortOrder
      };
      if (category.length > 0) {
        hotelFilters.hotelClassifications = category.map(item => item.id);
      }
      if (type.length > 0) {
        hotelFilters.hotelTypeIds = type.map(item => item.id).join(",");
      }
      if (basis.length > 0) {
        hotelFilters.boardBasis = basis.map(item => item.id);
      }
      if (hotel_facilities.length > 0 || room_facilities.length > 0) {
        hotelFilters.hotelFacilityIds = [
          ...hotel_facilities.map(item => item.id),
          ...room_facilities.map(item => item.id)
        ].join(",");
      }
      setFilters(hotelFilters);
      setIsLoading(true);
      offset.current = 1;
      setHotels([]);
      getHotels(1, srk, resultsToken, accessToken, hotelFilters);
    },
    [accessToken, getHotels, resultsToken, srk]
  );

  const renderFilters = () => (
    <FiltersPanelContent
      onBackPressedCb={handleFiltersClicked}
      control={control}
      setValue={setValue}
      orderValue={orderValue}
    />
  );

  const renderFiltersFooter = useCallback(
    () => (
      <View style={footerContainerStyle}>
        <Button
          title={t("done")}
          style={buttonStyle}
          labelStyle={whiteLabel}
          onPress={handleSubmit(handleFiltersApplied)}
        />
      </View>
    ),
    [footerContainerStyle, t, buttonStyle, whiteLabel, handleSubmit, handleFiltersApplied]
  );

  const handleFiltersClicked = () => {
    dispatch(
      showBottomSheet({
        Content: renderFilters,
        props: {
          bottomSheetStyle: {
            maxHeight: APP_SCREEN_HEIGHT * 0.9
          },
          FooterComponent: renderFiltersFooter,
          scrollViewProps: {
            keyboardShouldPersistTaps: "handled",
            showsVerticalScrollIndicator: false
          }
        }
      })
    );
    return logEvent(SEARCH_FILTERS_PRESSED, { source: ANALYTICS_SOURCE });
  };

  const updateHotelsCb = useCallback((hotelsParam: Hotel[]) => {
    offset.current = 1;
    hasReachedEnd.current = false;
    setHotels(hotelsParam);
  }, []);

  const handleHotelSelected = useCallback(
    async hotel => {
      await logEvent(HOTEL_SELECTED, { source: ANALYTICS_SOURCE, ...hotel });
      navigation.navigate("HotelDetails", {
        hotelIndex: hotel?.id,
        updateHotelsCb,
        filters
      });
    },
    [filters, navigation, updateHotelsCb]
  );

  const renderHotelItem = useCallback(
    ({ item }) => (
      <HotelsListCard
        minPrice={item.minPrice}
        hotel={item.details}
        onHotelPressed={handleHotelSelected}
      />
    ),
    [handleHotelSelected]
  );

  const handleGoToMapView = useCallback(() => {
    navigation.navigate({
      name: "HotelsMapView",
      params: {
        updateListViewHotels: updateHotelsCb,
        filters,
        hotels,
        position
      }
    });
    return logEvent(MAP_VIEW_PRESSED, { source: ANALYTICS_SOURCE });
  }, [hotels, navigation, position, updateHotelsCb]);

  const handleRoomSelected = useCallback(
    async roomsData => {
      setIsLoading(true);
      setHotels([]);
      setProgress(0);
      dispatch(setRooms({ rooms: roomsData }));
      modalizeRef.current?.close();
      payload.occupancy.rooms = roomsData;
      initializeHotels(payload);
      await logEvent(ROOMS_UPDATED, {
        source: ANALYTICS_SOURCE,
        selected_rooms_data: roomsData
      });
    },
    [dispatch, initializeHotels, payload]
  );

  const refreshControl = useMemo(
    () => (
      <RefreshControl
        tintColor={colors.primary_reversed}
        refreshing={isRefreshing}
        onRefresh={handleOnRefresh}
      />
    ),
    [colors.primary_reversed, handleOnRefresh, isRefreshing]
  );
  const handleDateSaved = useCallback(
    (tempCheckin, tempCheckout) => {
      modalizeRef.current?.close();
      setIsLoading(true);
      setHotels([]);
      setProgress(0);
      if (tempCheckin.isSameOrAfter(tempCheckout)) {
        dispatch(
          setCalendarDates({
            checkin: tempCheckin,
            checkout: moment(tempCheckin).add(1, "day")
          })
        );
        payload.checkIn = tempCheckin.format(MOMENT_YYY_MM_DD);
        payload.checkOut = moment(tempCheckin).add(1, "day").format(MOMENT_YYY_MM_DD);
        initializeHotels(payload);
        if (tempCheckout.diff(tempCheckin, "days") === 1) {
          dispatch(
            setCalendarTempDates({
              tempCheckin: tempCheckin,
              tempCheckout: tempCheckout
            })
          );
        }
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
      payload.checkIn = tempCheckin.format(MOMENT_YYY_MM_DD);
      payload.checkOut = tempCheckout.format(MOMENT_YYY_MM_DD);
      initializeHotels(payload);
      return logEvent(CALENDAR_CLOSED, { source: ANALYTICS_SOURCE });
    },
    [dispatch, initializeHotels, payload]
  );

  const isMapButtonDisabled = hotels?.length === 0;
  const isFiltersButtonDisabled = progress !== 100;

  return (
    <View style={flex}>
      <View style={headerStyle}>
        <Appbar.BackAction
          color={colors.primary_reversed}
          size={scale(20)}
          onPress={navigation.goBack}
        />
        <CText style={titleStyle} textAlign={"center"}>
          {searchTerm}
        </CText>
      </View>
      <View style={iconStyle}>
        <HotelsSearchAgain
          handleDateSaved={handleDateSaved}
          handleRoomSelected={handleRoomSelected}
          analyticsSource={ANALYTICS_SOURCE}
        />
      </View>
      <View style={greyBackgroundStyle} layout={LayoutAnimation.easeInEaseOut()}>
        {hotels?.length === 0 && (
          <>
            <View style={loadingContainerStyle}>
              <View style={loadingBackgroundStyle}>
                <CText
                  style={loadingTextStyle}
                  fontSize={15}
                  color={"white"}
                  textAlign={"center"}
                >{`${t("loading")} ${progress}%`}</CText>
              </View>
              <View style={progressContainerStyle}>
                <ProgressBar
                  style={progressStyle}
                  progress={progress / 100}
                  color={colors.primary_reversed}
                />
              </View>
            </View>
          </>
        )}
      </View>
      <FlatList
        style={flatlistStyle}
        contentContainerStyle={contentContainerStyle}
        data={hotels}
        renderItem={renderHotelItem}
        keyExtractor={keyExtractor}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderListEmptyComponent}
        onEndReached={handleOnEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={refreshControl}
      />
      <View style={buttonsWrapperStyle}>
        <View style={buttonsContainerStyle}>
          <TouchableOpacity
            disabled={isMapButtonDisabled}
            onPress={handleGoToMapView}
            style={settingsSelectorContainer}
          >
            <Icon
              color={colors.primary_reversed}
              type={IconTypes.MATERIAL_COMMUNITY_ICONS}
              disabled
              name={"map-marker-outline"}
              size={moderateScale(22)}
            />
            <CText fontSize={13} color={"primary_reversed"} style={filtersTextStyle}>
              {t("map")}
            </CText>
          </TouchableOpacity>
          <View style={filtersSpacingStyle} />
          <TouchableOpacity
            onPress={handleFiltersClicked}
            style={settingsSelectorContainer}
            disabled={isFiltersButtonDisabled}
          >
            <Icon
              color={colors.primary_reversed}
              type={IconTypes.SAFARWAY_ICONS}
              disabled
              name={"control"}
              height={moderateScale(22)}
              width={moderateScale(26)}
            />
            <CText fontSize={13} color={"primary_reversed"} style={filtersTextStyle}>
              {t("property_filters")}
            </CText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default memo(HotelsListView);
