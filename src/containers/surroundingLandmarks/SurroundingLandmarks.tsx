import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from "react";
import {
  StyleSheet,
  TouchableOpacity,
  unstable_batchedUpdates,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent
} from "react-native";

import { useNavigation } from "@react-navigation/core";
import { useTranslation } from "react-i18next";
import * as RNLocalize from "react-native-localize";
import MapView, { Region } from "react-native-maps";
import { useTheme } from "react-native-paper";
import Carousel from "react-native-snap-carousel";
import { useDispatch, useSelector } from "react-redux";

import landmarksStyle from "./surroundingLandmarks.styles";
import { IFilters, IMapCategories, SimpleProperty } from "./surroundingLandmarks.types";

import { RootState } from "~/redux/store";

import { surroundingLandMarksAPI } from "~/apis/";
import {
  MapPropertyTypesFilters,
  Marker,
  CText,
  CarouselMapItem,
  Icon,
  IconTypes,
  MapFilterModal
} from "~/components/";
import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import {
  darkGoogleMap,
  lightGoogleMap
} from "~/components/suggestProperty/locationSelector/LocationSelector.types";
import { IFilterValues } from "~/components/surroundingLandmarks/mapFilterModal/mapFilterModal.types";
import {
  APP_SCREEN_HEIGHT,
  APP_SCREEN_WIDTH,
  isRTL,
  PLATFORM
} from "~/constants/variables";
import { FavoriteItemModal } from "~/containers/favoriteList";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import { upsertProperties } from "~/redux/reducers/favorite.slice";
import { hideOverlay, showOverlay } from "~/redux/reducers/overlayLoader.reducer";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import { clearSurroundingLandmarkData } from "~/redux/reducers/surroundingLandmarks.reducer";
import { propertiesSelector } from "~/redux/selectors";
import { AppStackRoutesSurroundingLandmarksProps } from "~/router/AppStackRoutes/AppStackRoutes.type";
import {
  logEvent,
  SURROUNDING_LANDMARKS_GET_DATA,
  SURROUNDING_LANDMARKS_GET_DATA_FAILED,
  SURROUNDING_LANDMARKS_GET_DATA_NO_RESULTS,
  SURROUNDING_LANDMARKS_GET_DATA_SUCCESS,
  SURROUNDING_LANDMARKS_GET_FILTERS,
  SURROUNDING_LANDMARKS_GET_FILTERS_FAILED,
  SURROUNDING_LANDMARKS_GET_FILTERS_NO_RESULTS,
  SURROUNDING_LANDMARKS_GET_FILTERS_SUCCESS
} from "~/services/";
import { getDistanceBetweenLocations } from "~/services/location";
import { translate } from "~/translations/swTranslator";
import { normalizeByKey } from "~/utils/reduxUtil";
import { scale } from "~/utils/responsivityUtil";

let lastActiveCategory = -1;
const DEFAULT_MAP_ZOOM = 0.15;
const ITEM_WIDTH = APP_SCREEN_WIDTH - scale(70);

const SurroundingLandmarks: FC = (props: AppStackRoutesSurroundingLandmarksProps) => {
  const { colors } = useTheme();
  const { route } = props;
  const { showMyLocation = true } = route?.params || {};
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const isThemeDark = useSelector(
    (reduxState: RootState) => reduxState.settings.isThemeDark
  );
  const location = useSelector(
    (state: RootState) => state.surroundingLandmarks?.location
  );
  const _data = useSelector((state: RootState) => state.surroundingLandmarks?.data);

  const [isVisible, setIsVisible] = useState(false);
  const [propertyIds, setPropertyIds] = useState(_data);

  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [categories, setCategories] = useState<IMapCategories[]>();
  const [activeCategory, setActiveCategory] = useState<number>(-1);

  const country = RNLocalize.getCountry();

  const selectPropertyItems = useMemo(
    () => propertiesSelector(propertyIds),
    [propertyIds]
  );

  const data = useSelector(selectPropertyItems);

  const [region, setRegion] = useState({
    latitude: showMyLocation ? location?.latitude : data?.[0]?.location?.lat,
    longitude: showMyLocation ? location?.longitude : data?.[0]?.location?.lon,
    latitudeDelta: DEFAULT_MAP_ZOOM,
    longitudeDelta: DEFAULT_MAP_ZOOM
  });

  const [selectedSlug, setSelectedSlug] = useState(data?.[0]?.slug || "");
  const [askToSearch, setAskToSearch] = useState(false);
  const [isResearch, setIsResearch] = useState(false);
  const [filters, setFilters] = useState<IFilters[]>([]);
  const [filterValues, setFilterValues] = useState<IFilterValues>({
    priceRange: null,
    starRating: null,
    isOpen: false,
    selectedFilters: []
  });
  const properties = data || [];

  const mapRef = useRef<MapView>(null);
  const carouselRef = useRef<Carousel<any>>(null);

  const { t } = useTranslation();

  const checkAndroidPlatform = PLATFORM === "android" && isRTL;

  // first item (if android it's reversed so we take last item)
  const initialSlugSecondIndex = checkAndroidPlatform ? properties.length - 1 : 0;

  const isHotel = activeCategory === 999;

  useEffect(() => {
    return () => {
      dispatch(clearSurroundingLandmarkData({}));
    };
  }, [dispatch]);

  useLayoutEffect(() => {
    if (_data) {
      return navigation.setOptions({
        title: ""
      });
    }

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={onFilterPress}>
          <Icon
            type={IconTypes.SAFARWAY_ICONS}
            name={"control"}
            width={25}
            height={25}
            disabled
            color={colors.gray}
          />
        </TouchableOpacity>
      )
    });
  }, [filters, isHotel, filterValues, colors.gray, _data, navigation, onFilterPress]);

  useEffect(() => {
    surroundingLandMarksAPI
      .getCategories()
      .then(({ data }) => {
        setCategories([
          {
            title: {
              ar: "الكل",
              en: "All",
              fr: "Tout"
            },
            id: -1
          },
          ...data.filter(cat => cat.id !== 999)
        ]);
      })
      .catch(error => {
        dispatch(
          showSnackbar({
            text: translate("something_went_wrong"),
            type: SnackbarVariations.TOAST,
            duration: 2000,
            backgroundColor: "red"
          })
        );
      });
  }, []);

  useEffect(() => {
    const property = properties.find(item => item?.slug === selectedSlug);
    if (property && property.location.lat && property.location.lon) {
      mapRef?.current?.animateToRegion(
        {
          latitude: property.location.lat,
          longitude: property.location.lon,
          latitudeDelta: region.latitudeDelta,
          longitudeDelta: region.longitudeDelta
        },
        500
      );
    }
  }, [properties, selectedSlug]);

  useEffect(() => {
    if (_data) return;

    const payload = {
      ...region,
      filterValues,
      isHotel: activeCategory === 999
    };

    if (lastActiveCategory !== activeCategory) {
      lastActiveCategory = activeCategory;
      payload.latitude = region.latitude;
      payload.longitude = region.longitude;
    }

    if (activeCategory !== -1) {
      payload.filter = activeCategory;
    }

    setIsLoading(true);
    dispatch(showOverlay({ visible: true, backgroundColor: colors.darkOverlay }));
    const analyticsProps = {
      source: "surrounding_landmarks_page",
      active_category: activeCategory,
      latitude: payload.latitude,
      longitude: payload.longitude,
      filter: filterValues
    };
    logEvent(SURROUNDING_LANDMARKS_GET_DATA, analyticsProps);
    surroundingLandMarksAPI
      .getPropertyByLocation(payload)
      .then(async ({ data }) => {
        await logEvent(SURROUNDING_LANDMARKS_GET_DATA_SUCCESS, analyticsProps);
        if (!data?.items?.length) {
          await logEvent(SURROUNDING_LANDMARKS_GET_DATA_NO_RESULTS, analyticsProps);
          setNoResults(true);
          const timeout = setTimeout(() => {
            setNoResults(false);
            clearTimeout(timeout);
          }, 3000);
        }
        const propertiesData = data?.items;
        const optimizedProperties = propertiesData.reduce(normalizeByKey("pkey"), {});

        dispatch(upsertProperties(optimizedProperties));

        const sortedData = propertiesData.sort((firstEl, secondEl) => {
          const _location = {
            lat: location?.latitude,
            lon: location?.longitude
          };
          return (
            Number(getDistanceBetweenLocations(firstEl?.location, _location)) -
            Number(getDistanceBetweenLocations(secondEl?.location, _location))
          );
        });

        setPropertyIds(sortedData?.map(item => item?.pkey));

        setSelectedSlug(sortedData[0]?.slug ?? "");
        carouselRef?.current &&
          carouselRef?.current?.snapToItem(
            checkAndroidPlatform ? sortedData?.length - 1 : 0,
            true
          );
      })
      .catch(async error => {
        dispatch(
          showSnackbar({
            text: translate("something_went_wrong"),
            type: SnackbarVariations.TOAST,
            duration: 2000,
            backgroundColor: "red"
          })
        );
        await logEvent(SURROUNDING_LANDMARKS_GET_DATA_FAILED, analyticsProps);
      })
      .finally(() => {
        dispatch(hideOverlay());
      });
  }, [activeCategory, isResearch, filterValues]);

  useEffect(() => {
    if (activeCategory === -1) {
      setFilters([]);
    }
    const analyticsProps = {
      source: "surrounding_landmarks_page",
      longitude: region?.longitude,
      latitude: region?.latitude,
      active_category: activeCategory
    };

    logEvent(SURROUNDING_LANDMARKS_GET_FILTERS, analyticsProps);

    surroundingLandMarksAPI
      .getTypeFilters(activeCategory)
      .then(async ({ data }) => {
        await logEvent(SURROUNDING_LANDMARKS_GET_FILTERS_SUCCESS, analyticsProps);
        setFilters(data?.items);
        if (data?.items?.length === 0) {
          await logEvent(SURROUNDING_LANDMARKS_GET_FILTERS_NO_RESULTS, analyticsProps);
        }
      })
      .catch(async error => {
        dispatch(
          showSnackbar({
            text: translate("something_went_wrong"),
            type: SnackbarVariations.TOAST,
            duration: 2000,
            backgroundColor: "red"
          })
        );
        await logEvent(SURROUNDING_LANDMARKS_GET_FILTERS_FAILED, analyticsProps);
      });
  }, [activeCategory]);

  const onFilterPress = useCallback(() => {
    dispatch(
      showBottomSheet({
        Content: () => (
          <MapFilterModal
            filters={filters}
            isHotel={isHotel}
            currentFilterValues={filterValues}
            onSave={onFilterSave}
          />
        ),
        props: {
          modalHeight: APP_SCREEN_HEIGHT * 0.9,
          snapPoints: [APP_SCREEN_HEIGHT * 0.6, APP_SCREEN_HEIGHT * 0.9],
          scrollViewProps: {
            keyboardShouldPersistTaps: "handled"
          }
        },
        customProps: {}
      })
    );
  }, [dispatch, filterValues, filters, isHotel]);

  const onFilterSave = (value: IFilterValues) => {
    setPropertyIds([]);
    setFilterValues(value);
  };

  const renderMarker = useCallback(
    (item: SimpleProperty, isHotel: boolean, index: number) => {
      const handleMarker = () => {
        carouselRef?.current &&
          carouselRef?.current?.snapToItem(
            checkAndroidPlatform ? initialSlugSecondIndex - index : index,
            true
          );
        setSelectedSlug(item?.slug);
      };

      return (
        <Marker
          isHotel={isHotel}
          key={item?.slug}
          slug={item?.slug}
          onPress={handleMarker}
          coordinate={{
            latitude: Number(item.location.lat),
            longitude: Number(item.location.lon)
          }}
          selected={selectedSlug === item?.slug}
        />
      );
    },
    [selectedSlug]
  );

  const onRegionChangeComplete = (_region: Region) => {
    setRegion(_region);

    if (isLoading) return setIsLoading(false);

    setAskToSearch(true);
  };

  const onResearchPress = () => {
    setPropertyIds([]);
    unstable_batchedUpdates(() => {
      setIsResearch(prev => !prev);
      setAskToSearch(false);
    });
  };

  const onIndexChanged = useCallback(
    (index: number) => {
      setSelectedSlug(
        properties[checkAndroidPlatform ? initialSlugSecondIndex - index : index]?.slug ??
          ""
      );
    },
    [properties]
  );
  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offset: number = event.nativeEvent.contentOffset.x;
      let index: number;
      if (offset <= 0) {
        index = 0;
      } else if (offset < ITEM_WIDTH) {
        index = 1;
      } else {
        index = Math.round(offset / ITEM_WIDTH);
      }
      onIndexChanged(index);
    },
    [properties, onIndexChanged]
  );

  const { root, headerContainer, askToSearchStyle, carouselRoot, noResultsStyle } =
    landmarksStyle;

  const renderItem = useCallback(
    props => (
      <CarouselMapItem
        {...props}
        location={location}
        country={country}
        isHotel={isHotel}
        setIsVisible={setIsVisible}
      />
    ),
    [country, isHotel, location]
  );

  const getItemLayout = (item, index: number) => {
    return {
      index,
      length: ITEM_WIDTH,
      offset: index * ITEM_WIDTH
    };
  };

  const CarouselMap = useMemo(() => {
    const carouselProps = checkAndroidPlatform
      ? {
          enableSnap: false,
          pagingEnabled: true,
          onScroll: onMomentumScrollEnd,
          snapToInterval: ITEM_WIDTH,
          disableIntervalMomentum: true,
          useScrollView: true,
          enableMomentum: false,
          scrollEventThrottle: 10,
          firstItem: initialSlugSecondIndex
        }
      : {
          enableMomentum: true,
          onSnapToItem: onIndexChanged,
          useScrollView: false,
          firstItem: 0
        };
    return (
      <Carousel
        ref={carouselRef}
        data={properties}
        renderItem={renderItem}
        sliderWidth={APP_SCREEN_WIDTH}
        itemWidth={ITEM_WIDTH}
        removeClippedSubviews={false}
        decelerationRate={0.9}
        getItemLayout={getItemLayout}
        {...carouselProps}
      />
    );
  }, [properties, checkAndroidPlatform]);

  const handleOnCategoryPress = useCallback(categoryId => {
    setPropertyIds([]);
    setActiveCategory(categoryId);
    setFilterValues({
      priceRange: null,
      starRating: null,
      isOpen: false,
      selectedFilters: []
    });
  }, []);

  return (
    <View style={root}>
      <FavoriteItemModal setIsVisible={setIsVisible} isVisible={isVisible} />
      <MapView
        ref={mapRef}
        initialRegion={region}
        animationEnabled={false}
        moveOnMarkerPress={false}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsBuildings={false}
        showsPointsOfInterest={false}
        showsTraffic={false}
        showsCompass={false}
        customMapStyle={isThemeDark ? darkGoogleMap : lightGoogleMap}
        userInterfaceStyle={isThemeDark ? "dark" : "light"}
        showsIndoors={false}
        toolbarEnabled={false}
        onRegionChangeComplete={onRegionChangeComplete}
        minPoints={5}
        style={StyleSheet.absoluteFillObject}
      >
        {showMyLocation && location && (
          <Marker
            myLocation
            coordinate={{
              latitude: Number(location.latitude),
              longitude: Number(location.longitude)
            }}
          />
        )}

        {properties?.map((property, index) => renderMarker(property, isHotel, index))}
      </MapView>
      {!_data ? (
        <View style={headerContainer}>
          {categories && (
            <MapPropertyTypesFilters
              categories={categories}
              activeCategory={activeCategory}
              onCategoryPress={handleOnCategoryPress}
            />
          )}
          {noResults && (
            <View style={noResultsStyle}>
              <CText color="white" fontSize={13}>
                {t("no_results")}
              </CText>
            </View>
          )}
          {askToSearch && (
            <TouchableOpacity
              onPress={onResearchPress}
              activeOpacity={0.8}
              style={askToSearchStyle}
            >
              <CText color={"white"} fontSize={12} fontFamily="light">
                {translate("search_in_this_area")}
              </CText>
            </TouchableOpacity>
          )}
        </View>
      ) : null}
      <View style={carouselRoot}>{properties && CarouselMap}</View>
    </View>
  );
};

export { SurroundingLandmarks };
