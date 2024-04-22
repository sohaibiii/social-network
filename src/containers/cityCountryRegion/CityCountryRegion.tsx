import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  InteractionManager,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  TouchableOpacity,
  View
} from "react-native";

import Clipboard from "@react-native-clipboard/clipboard";
import { useFocusEffect } from "@react-navigation/native";
import color from "color";
import moment from "moment";
import { useTranslation } from "react-i18next";
import Config from "react-native-config";
import LinearGradient from "react-native-linear-gradient";
import { ActivityIndicator, Appbar, useTheme } from "react-native-paper";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from "react-native-reanimated";
import { RFValue } from "react-native-responsive-fontsize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { DataProvider, LayoutProvider, RecyclerListView } from "recyclerlistview";

import { default as propertyStyles } from "./../property/Property.styles";
import styles from "./CityCountryRegion.styles";
import { DestinationsType } from "./CityCountryRegion.types";

import { RootState } from "~/redux/store";

import articleService from "~/apiServices/article";
import { Articles } from "~/apiServices/article/article.types";
import cityService from "~/apiServices/city";
import { CommonGeoPlace, Weather } from "~/apiServices/city/city.types";
import countryService from "~/apiServices/country";
import regionService from "~/apiServices/region";
import FLAGS from "~/assets/images/flags";
import { TranslatedInlineReadMore, WeatherSkeleton } from "~/components/";
import {
  BestMonths,
  BestMonthToVisitInfo,
  CityCountryRegionSkeleton
} from "~/components/cityCountryRegion";
import { ViewMorePropertyCard } from "~/components/cityCountryRegion/ViewMorePropertyCard";
import {
  CText,
  Icon,
  IconTypes,
  InlineReadMore,
  MapPreview,
  ProgressiveImage,
  SliderSection
} from "~/components/common";
import AdsItem from "~/components/common/AdsItem/AdsItem";
import {
  InlineReadMoreMode,
  InlineReadMoreType
} from "~/components/common/InlineReadMore/InlineReadMore.types";
import { ArticleCard, PropertyCard, ProperyCardSkeleton } from "~/components/home";
import { CITY_COUNTRY_REGION_AD } from "~/constants/";
import {
  APP_SCREEN_HEIGHT,
  APP_SCREEN_WIDTH,
  HORIZONTAL_SLIDER_HEIGHT
} from "~/constants/variables";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import { setSearchCountryCityRegionTerm } from "~/redux/reducers/countyCityRegion.reducer";
import { upsertProperties } from "~/redux/reducers/favorite.slice";
import { showGalleryViewer } from "~/redux/reducers/galleryViewer.reducer";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import { AppStackRoutesCityCountryRegionProps } from "~/router/AppStackRoutes/AppStackRoutes.type";
import {
  logEvent,
  openURL,
  COPIED_TEXT,
  SHOW_GALLERY,
  HOTELS_VISITED,
  CITY_COUNTRY_REGION_NAVIGATE_TO_SEARCH,
  CITY_COUNTRY_REGION_SHARE,
  CITY_COUNTRY_REGION_SHARE_SUCCESS,
  CITY_COUNTRY_REGION_SHARE_FAILED,
  CITY_COUNTRY_REGION_OPEN_BEST_TIME_SHEET,
  CITY_COUNTRY_REGION_OPEN_MAP,
  NAVIGATE_TO_CITY_COUNTRY_REGION_RELATED_PROPERTIES,
  CITY_COUNTRY_REGION_GET_RELATED_PROPERTIES,
  CITY_COUNTRY_REGION_GET_RELATED_PROPERTIES_SUCCESS,
  CITY_COUNTRY_REGION_GET_RELATED_PROPERTIES_FAILED,
  CITY_COUNTRY_REGION_GET_ARTICLES,
  CITY_COUNTRY_REGION_GET_ARTICLES_SUCCESS,
  CITY_COUNTRY_REGION_GET_ARTICLES_FAILED,
  CITY_COUNTRY_REGION_GET_DATA_SUCCESS,
  CITY_COUNTRY_REGION_GET_DATA_FAILED,
  CITY_COUNTRY_REGION_GET_DATA
} from "~/services/";
import {
  DynamicLinksAction,
  handleCreateShareLink,
  showShareView
} from "~/services/rnFirebase/dynamicLinks";
import {
  generalErrorHandler,
  logError,
  moderateScale,
  scale,
  verticalScale
} from "~/utils/";
import { normalizeByKey } from "~/utils/reduxUtil";

const parallaxHeaderHeight = verticalScale(300);

const dataProvider = new DataProvider((r1, r2) => {
  return r1.pkey !== r2.pkey;
});

const _layoutProvider = new LayoutProvider(
  index => {
    return index;
  },
  (type, dim) => {
    dim.width = 156;
    dim.height = HORIZONTAL_SLIDER_HEIGHT;
  }
);

const LAYOUT_SIZE = {
  height: HORIZONTAL_SLIDER_HEIGHT,
  width: APP_SCREEN_WIDTH
};

const ANALYTICS_SOURCE = "city_country_region_page";

const CityCountryRegion = (props: AppStackRoutesCityCountryRegionProps): JSX.Element => {
  const { route, navigation } = props;
  const { slug, type } = route?.params;
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const userToken = useSelector((state: RootState) => state.auth.userToken, shallowEqual);

  const [destinationInfo, setDestinationInfo] = useState<CommonGeoPlace | undefined>();
  const [relatedProperties, setRelatedProperties] = useState([
    { pkey: "", title: "", total: 1, items: [] }
  ]);
  const [articles, setArticles] = useState<Articles | undefined>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRelatedPropertiesLoading, setisRelatedPropertiesLoading] = useState(true);
  const [weather, setWeather] = useState<Weather | undefined>();
  const [isLoadingShare, setIsLoadingShare] = useState(false);
  const [startLoading, setStartLoading] = useState(false);

  const configs = useSelector((state: RootState) => state.ads.configs);
  const config = configs[CITY_COUNTRY_REGION_AD.config];

  const dispatch = useDispatch();
  const y = useSharedValue(0);

  const language = useSelector((state: RootState) => state.settings.language);

  useEffect(() => {
    const unsubscribe = navigation.addListener("transitionEnd", e => {
      setStartLoading(true);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (!startLoading) {
      return;
    }
    let latLng = "";

    const analyticsProps = {
      source: ANALYTICS_SOURCE,
      slug,
      type
    };

    logEvent(CITY_COUNTRY_REGION_GET_DATA, analyticsProps);

    if (type === DestinationsType.CITY) {
      cityService
        .getCityBySlug(slug)
        .then((data: CommonGeoPlace | undefined) => {
          latLng = `${data?.location?.lat},${data?.location?.lon}`;
          setDestinationInfo(data);
          logEvent(CITY_COUNTRY_REGION_GET_DATA_SUCCESS, analyticsProps);
          return cityService.getWeatherByLatLon(latLng);
        })
        .then(weatherData => {
          setWeather(weatherData);
        })
        .catch(error => {
          logEvent(CITY_COUNTRY_REGION_GET_DATA_FAILED, analyticsProps);
          logError(
            `Error: getCityBySlug --CityCountryRegion.tsx-- slug=${slug} ${error}`
          );
        })
        .finally(() => {
          InteractionManager.runAfterInteractions(() => {
            setIsLoading(false);
          });
        });
    } else if (type === DestinationsType.REGION) {
      regionService
        .getRegionBySlug(slug)
        .then((data: CommonGeoPlace | undefined) => {
          setDestinationInfo(data);
          logEvent(CITY_COUNTRY_REGION_GET_DATA_SUCCESS, analyticsProps);
          latLng = `${data?.location?.lat},${data?.location?.lon}`;
          return cityService.getWeatherByLatLon(latLng);
        })
        .then(weatherData => {
          setWeather(weatherData);
        })
        .catch(error => {
          logEvent(CITY_COUNTRY_REGION_GET_DATA_FAILED, analyticsProps);
          logError(
            `Error: getRegionBySlug --CityCountryRegion.tsx-- slug=${slug} ${error}`
          );
        })
        .finally(() => {
          InteractionManager.runAfterInteractions(() => {
            setIsLoading(false);
          });
        });
    } else if (type === DestinationsType.COUNTRY) {
      countryService
        .getCountryBySlug(slug)
        .then((data: CommonGeoPlace | undefined) => {
          setDestinationInfo(data);
          logEvent(CITY_COUNTRY_REGION_GET_DATA_SUCCESS, analyticsProps);
          latLng = `${data?.location?.lat},${data?.location?.lon}`;
          return cityService.getWeatherByLatLon(latLng);
        })
        .then(weatherData => {
          setWeather(weatherData);
        })
        .catch(error => {
          logEvent(CITY_COUNTRY_REGION_GET_DATA_FAILED, analyticsProps);
          logError(
            `Error: getCountryBySlug --CityCountryRegion.tsx-- slug=${slug} ${error}`
          );
        })
        .finally(() => {
          InteractionManager.runAfterInteractions(() => {
            setIsLoading(false);
          });
        });
    }
  }, [slug, startLoading, type]);

  const getRelatedPropertiesByCategoryId = useCallback(async () => {
    if (!destinationInfo?.pkey) {
      return;
    }
    // setisRelatedPropertiesLoading(true);
    const analyticsProps = {
      source: ANALYTICS_SOURCE,
      slug,
      type,
      destination_pkey: destinationInfo?.pkey
    };

    await logEvent(CITY_COUNTRY_REGION_GET_RELATED_PROPERTIES, analyticsProps);

    const serviceReq =
      type === DestinationsType.COUNTRY
        ? countryService.getCountryPropertiesByPkey
        : type === DestinationsType.REGION
        ? regionService.getRegionPropertiesByPkey
        : cityService.getCityProperties;

    serviceReq(destinationInfo?.pkey)
      .then(async data => {
        await logEvent(
          CITY_COUNTRY_REGION_GET_RELATED_PROPERTIES_SUCCESS,
          analyticsProps
        );
        if (!data || data?.length === 0) {
          return;
        }

        let propertiesMapped = {};
        for (let index = 0; index < data?.length; index++) {
          const element = data[index];
          const optimizedProperties = element?.items?.reduce(normalizeByKey("pkey"), {});
          propertiesMapped = { ...propertiesMapped, ...optimizedProperties };
        }
        dispatch(upsertProperties(propertiesMapped));

        const formattedData = data.map(item => ({
          title: item?.title,
          pkey: item?.pkey,
          total: item?.total,
          items: item?.items.map(item2 => ({
            pkey: item2.pkey,
            city: item2.city,
            country: item2.country,
            featured_image: item2.featured_image,
            rate: item2.rate,
            slug: item2.slug,
            title: item2.title,
            location: item2.location
          }))
        }));
        setRelatedProperties(formattedData);
      })
      .catch(async error => {
        await logEvent(CITY_COUNTRY_REGION_GET_RELATED_PROPERTIES_FAILED, analyticsProps);
        logError(
          `Error: getRelatedPropertiesByCategoryId --CityCountryRegion.tsx-- slug=${slug} ${error}`
        );
      })
      .finally(() => {
        setisRelatedPropertiesLoading(false);
      });
  }, [dispatch, destinationInfo?.pkey, type]);

  // to get articles
  useEffect(() => {
    if (!startLoading) {
      return;
    }
    if (destinationInfo?.pkey) {
      const analyticsProps = {
        source: ANALYTICS_SOURCE,
        slug,
        type
      };

      logEvent(CITY_COUNTRY_REGION_GET_ARTICLES, analyticsProps);

      articleService
        .getArticles(
          0,
          10,
          undefined,
          type === "country" ? destinationInfo.pkey : undefined,
          type === "region" ? destinationInfo.pkey : undefined,
          type === "city" ? destinationInfo.pkey : undefined
        )
        .then(async data => {
          await logEvent(CITY_COUNTRY_REGION_GET_ARTICLES_SUCCESS, analyticsProps);
          setArticles(data?.articles);
        })
        .catch(async error => {
          await logEvent(CITY_COUNTRY_REGION_GET_ARTICLES_FAILED, analyticsProps);
          generalErrorHandler(
            `Error: getArticles --CityCountryRegion.tsx-- type=${type} destinationPkey=${destinationInfo.pkey} ${error}`
          );
        });
    }
  }, [type, destinationInfo, slug, startLoading]);

  const handleShare = useCallback(async () => {
    setIsLoadingShare(true);
    await logEvent(CITY_COUNTRY_REGION_SHARE, {
      source: ANALYTICS_SOURCE,
      slug
    });

    handleCreateShareLink({
      action: DynamicLinksAction.GEO_PLACE,
      title: destinationInfo?.name,
      description: destinationInfo?.description,
      image: destinationInfo?.featuredImageUUID,
      params: {
        slug,
        type
      }
    })
      .then(async link => {
        await logEvent(CITY_COUNTRY_REGION_SHARE_SUCCESS, {
          source: ANALYTICS_SOURCE,
          slug
        });
        showShareView(link);
      })
      .catch(async () => {
        await logEvent(CITY_COUNTRY_REGION_SHARE_FAILED, {
          source: ANALYTICS_SOURCE,
          slug
        });
        logError(
          `Error: handleCreateShareLink --CityCountryRegion.tsx-- slug=${slug} type=${type}`
        );
      })
      .finally(() => {
        setIsLoadingShare(false);
      });
  }, [
    destinationInfo?.name,
    destinationInfo?.description,
    destinationInfo?.featuredImageUUID,
    slug,
    type
  ]);

  const {
    country,
    title,
    description,
    currency,
    languages,
    featuredImageUUID,
    livingCost,
    months,
    location,
    gallery,
    bestTimeToVisit,
    originalDescription,
    translationSource
  } = destinationInfo || {};

  useEffect(() => {
    if (!!destinationInfo && !featuredImageUUID) {
      logError(`Error: Featured image --CityCountryRegion.tsx-- slug=${slug}`);
    }
  }, [destinationInfo]);

  const initialRegion = useMemo(() => {
    return {
      latitude: location?.lat,
      longitude: location?.lon,
      latitudeDelta: location?.latDelta ?? 0.005,
      longitudeDelta: location?.lonDelta ?? 0.005
    };
  }, [location?.lat, location?.lon, location?.latDelta, location?.lonDelta]);

  const markers = useMemo(
    () => [
      {
        identifier: "Marker1",
        latitude: location?.lat,
        longitude: location?.lon
      }
    ],
    [location?.lat, location?.lon]
  );

  const renderBestTimeDetails = useCallback(() => {
    return <BestMonthToVisitInfo slug={slug} bestTimeToVisit={bestTimeToVisit} />;
  }, [bestTimeToVisit]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        dispatch(setSearchCountryCityRegionTerm({ searchCountryCityRegionTerm: "" }));
      };
    }, [dispatch])
  );

  const handleCopy = useCallback(
    async (text: string) => {
      Clipboard.setString(text);
      await logEvent(COPIED_TEXT, {
        source: ANALYTICS_SOURCE,
        text: text?.substr(0, 30),
        slug
      });

      dispatch(showSnackbar({ text: t("text_copied"), duration: 1000 }));
    },
    [dispatch, t]
  );

  const openLinkInSafarwayWebview = useCallback(async () => {
    await logEvent(HOTELS_VISITED, {
      source: ANALYTICS_SOURCE,
      slug,
      type
    });
    return navigation.navigate("HotelsSearch");
  }, [slug, type, navigation]);

  const handleSearchCity = useCallback(async () => {
    await logEvent(CITY_COUNTRY_REGION_NAVIGATE_TO_SEARCH, {
      source: ANALYTICS_SOURCE,
      slug
    });

    return navigation.navigate({
      name: "SearchCityCountyRegion",
      key: `${moment().unix()}`,
      params: { destinationInfo, type, slug }
    });
  }, [destinationInfo, type, slug, navigation]);

  const handleBestTimeToVisitInfo = useCallback(async () => {
    await logEvent(CITY_COUNTRY_REGION_OPEN_BEST_TIME_SHEET, {
      source: ANALYTICS_SOURCE,
      slug,
      type
    });

    dispatch(
      showBottomSheet({
        Content: renderBestTimeDetails,
        props: {
          modalBackgroundColor: theme.colors.surface,
          bottomSheetStyle: {
            maxHeight: APP_SCREEN_HEIGHT * 0.9
          }
        }
      })
    );
  }, [dispatch, renderBestTimeDetails, theme.colors.surface]);

  const galleryFormatted = useMemo(
    () =>
      gallery?.map(item => {
        return {
          uri: `${Config.CONTENT_MEDIA_PREFIX}/${item.uuid}_sm.jpg`,
          owner: item.owner,
          source: item.source
        };
      }) || [],
    [gallery]
  );

  const LINEAR_GRADIENT_COLORS = useMemo(() => {
    const wheatherBackground1 = color(theme.colors.primaryBackground)
      .alpha(0.7)
      .rgb()
      .string();
    const wheatherBackground2 = color(theme.colors.primaryBackground)
      .alpha(0.9)
      .rgb()
      .string();

    return [wheatherBackground1, wheatherBackground2];
  }, [theme.colors.primaryBackground]);

  const HeaderHeight = useMemo(() => verticalScale(40) + insets.top, [insets.top]);

  const {
    weatherWrapperStyle,
    weatherWrapperContainer,
    destinationTitleStyle,
    destinationFlagImageStyle,
    destinationTitleTextStyle,
    descriptionWrapperStyle,
    detailsInfoWrapperStyle,
    languageCurrencyContainerStyle,
    flexRowCenter,
    flexOneRowCenter,
    livingCostWrapperStyle,
    planYourTripButtonStyle,
    articlesScrollViewContainerStyle,
    propertiesScrollViewContainerStyle,
    propertyContainerStyle,
    headerIconStyle,
    rightHeaderStyle,
    dividerStyle,
    parallaxBodyWrapperStyle,
    parallaxBodyBackground,
    mapContainerStyle,
    backArrowStyle,
    recycleViewStyle
  } = useMemo(() => styles(theme, insets, parallaxHeaderHeight), [theme, insets]);

  const {
    stickyHeaderStyle,
    stickyHeaderBackIconStyle,
    stickyHeaderTitleWrapperStyle,
    shareIconWrapperStyle,
    imageGalleryIconWrapperStyle,
    parallaxHeaderWrapperStyle,
    parallaxHeaderTouchableStyle,
    imagesLengthTextStyle,
    overlayWrapperStyle,
    coverImageStyle,
    actionWrapperParallelStyle,
    actionsWrapperStyle,
    sliderSectionWrapperStyle
  } = useMemo(() => propertyStyles(theme, insets, parallaxHeaderHeight), [theme, insets]);

  const showImageGallery = useCallback(async () => {
    await logEvent(SHOW_GALLERY, {
      source: ANALYTICS_SOURCE,
      source_slug: slug,
      source_specific_type: type
    });
    dispatch(
      showGalleryViewer({
        data: galleryFormatted,
        isVisible: true,
        disableThumbnailPreview: false,
        currentIndex: 0,
        sourceType: ANALYTICS_SOURCE,
        sourceIdentifier: slug
      })
    );
  }, [dispatch, galleryFormatted]);

  const IMAGES_LENGTH = gallery?.length || 0;
  const coverPhoto = `${Config.CONTENT_MEDIA_PREFIX}/${featuredImageUUID}`;

  const onMapPreviewPress = useCallback(async () => {
    await logEvent(CITY_COUNTRY_REGION_OPEN_MAP, {
      source: ANALYTICS_SOURCE,
      slug,
      type
    });

    return navigation.navigate("MapView", {
      initialRegion: {
        latitude: location.lat,
        longitude: location.lon,
        latitudeDelta: location?.latDelta ?? 0.005,
        longitudeDelta: location?.lonDelta ?? 0.005
      },
      markers: [
        {
          identifier: "Marker1",
          latitude: location.lat,
          longitude: location.lon
        }
      ]
    });
  }, [navigation, location]);

  const handleMorePropertyCallback = useCallback(
    async relatedProperty => {
      const { pkey, title: propertiesTitle, total } = relatedProperty;

      await logEvent(NAVIGATE_TO_CITY_COUNTRY_REGION_RELATED_PROPERTIES, {
        source: ANALYTICS_SOURCE,
        slug,
        pkey,
        destination_pkey: destinationInfo?.pkey,
        title: propertiesTitle
      });

      navigation.navigate("CityCountryRegionRelatedProperties", {
        type,
        destinationPkey: destinationInfo?.pkey,
        pkey,
        total,
        title,
        propertiesTitle
      });
    },
    [destinationInfo?.pkey, navigation, title, type]
  );

  const animatedStickyHeaderStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(
        interpolate(
          y.value,
          [
            parallaxHeaderHeight - 2 * HeaderHeight,
            parallaxHeaderHeight - HeaderHeight,
            parallaxHeaderHeight
          ],
          [0, 0.7, 1],
          Extrapolate.CLAMP
        ),
        { damping: 15 }
      )
    };
  });

  const renderParallaxHeader = useCallback(() => {
    return (
      <>
        <TouchableOpacity style={parallaxHeaderWrapperStyle} onPress={showImageGallery}>
          <View style={weatherWrapperContainer}>
            {weather ? (
              <LinearGradient colors={LINEAR_GRADIENT_COLORS} style={weatherWrapperStyle}>
                <>
                  <CText fontSize={20} color={"gray"} lineHeight={25}>
                    {moment(weather?.localtime).locale("en").format("hh:mm")}
                  </CText>
                  <CText fontSize={18} color={"gray"} lineHeight={23} fontFamily="thin">
                    {moment(weather?.localtime).format("A")}
                  </CText>
                  <View style={dividerStyle} />
                  <CText fontSize={16} color={"gray"} lineHeight={21}>
                    {`${weather?.min}° - ${weather?.max}°`}
                  </CText>
                  <CText fontSize={24} color={"gray"} lineHeight={32}>
                    {weather?.current}°
                  </CText>
                  <Icon
                    type={IconTypes.SAFARWAY_ICONS}
                    name={`w${weather?.weatherCode}_${weather?.weatherIconType}`}
                    width={scale(35)}
                    height={scale(35)}
                  />
                </>
              </LinearGradient>
            ) : (
              <WeatherSkeleton />
            )}
          </View>
          <TouchableOpacity
            onPress={showImageGallery}
            style={parallaxHeaderTouchableStyle}
          >
            {coverPhoto !== "" && (
              <ProgressiveImage
                style={coverImageStyle}
                resizeMode={"cover"}
                thumbnailSource={{
                  uri: `${coverPhoto}_xs.jpg`
                }}
                source={{
                  uri: `${coverPhoto}_md.jpg`
                }}
                errorSource={{ uri: `${coverPhoto}_md.jpg` }}
              />
            )}
          </TouchableOpacity>
          <View style={overlayWrapperStyle} />
          <View style={actionWrapperParallelStyle}>
            {!!IMAGES_LENGTH && (
              <TouchableOpacity
                style={imageGalleryIconWrapperStyle}
                onPress={showImageGallery}
              >
                <Icon
                  type={IconTypes.ION_ICONS}
                  name="ios-images-outline"
                  size={23}
                  color={"white"}
                />
                <CText
                  color="white"
                  fontSize={12}
                  style={imagesLengthTextStyle}
                >{`(${IMAGES_LENGTH})`}</CText>
              </TouchableOpacity>
            )}
            {isLoadingShare ? (
              <View style={shareIconWrapperStyle}>
                <ActivityIndicator color={theme.colors.white} size={23} />
              </View>
            ) : (
              <TouchableOpacity style={shareIconWrapperStyle} onPress={handleShare}>
                <Icon type={IconTypes.FONTISTO} name="share" size={20} color={"white"} />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
        <Appbar.BackAction
          style={backArrowStyle}
          color={"white"}
          size={scale(18)}
          onPress={goBackHandler}
        />
        <TouchableOpacity disabled activeOpacity={1} style={parallaxBodyWrapperStyle}>
          <View style={parallaxBodyBackground}>
            <View style={rightHeaderStyle}>
              <TouchableOpacity
                style={headerIconStyle}
                onPress={handleSearchCity}
                disabled={isLoading}
              >
                <CText color="gray" fontSize={16} lineHeight={21} textAlign="left">
                  {t("select_city")}
                </CText>
                <Icon
                  type={IconTypes.MATERIAL_ICONS}
                  name={"arrow-drop-down"}
                  size={moderateScale(22)}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
            <View style={destinationTitleStyle}>
              {!!country?.code && (
                <Image
                  resizeMode={"cover"}
                  source={FLAGS[country?.code]}
                  style={destinationFlagImageStyle}
                />
              )}
              <TouchableOpacity onLongPress={() => handleCopy(cityCountryRegionTitle)}>
                <CText
                  fontSize={19}
                  lineHeight={29}
                  textAlign="center"
                  style={destinationTitleTextStyle}
                >
                  {cityCountryRegionTitle}
                </CText>
              </TouchableOpacity>
            </View>
            <View style={descriptionWrapperStyle}>
              {(!!description || !!originalDescription) && (
                <TranslatedInlineReadMore
                  analyticsSource={ANALYTICS_SOURCE}
                  description={description}
                  originalDescription={originalDescription}
                  translationSource={translationSource}
                  hasReadLess
                  slug={slug}
                  type={InlineReadMoreType.SUMMARY}
                  maxNumberOfLinesToShow={4}
                  handleCopy={handleCopy}
                  mode={InlineReadMoreMode.FULL_HEIGHT_WIDTH}
                  textProps={{
                    textAlign: "left",
                    fontSize: 12,
                    style: {
                      lineHeight: RFValue(20)
                    },
                    fontFamily: "light",
                    color: "text"
                  }}
                />
              )}
            </View>
            <View>
              <View style={detailsInfoWrapperStyle}>
                <View style={flexRowCenter}>
                  <CText fontSize={12} color="text" textAlign="center">
                    {t("languages")}
                  </CText>
                  {languages?.map(language => {
                    return (
                      <View style={languageCurrencyContainerStyle} key={`${language}`}>
                        <CText fontSize={13} lineHeight={18} fontFamily="light">
                          {language}
                        </CText>
                      </View>
                    );
                  })}
                </View>
                <View style={flexRowCenter}>
                  <CText fontSize={12} color="text" textAlign="center">
                    {t("currencies")}
                  </CText>
                  <View style={languageCurrencyContainerStyle}>
                    <CText fontSize={13} lineHeight={18} fontFamily="light">
                      {currency}
                    </CText>
                  </View>
                </View>
              </View>
              {!!livingCost && (
                <View style={livingCostWrapperStyle}>
                  <CText color="text" fontSize={16} lineHeight={30} textAlign="left">
                    {t("living_cost")}
                  </CText>
                  <InlineReadMore
                    slug={slug}
                    type={InlineReadMoreType.SUMMARY}
                    hasReadLess
                    maxNumberOfLinesToShow={5}
                    textProps={{
                      textAlign: "left",
                      fontSize: 12,
                      style: {
                        lineHeight: RFValue(20)
                      },
                      fontFamily: "light",
                      color: "text"
                    }}
                  >
                    {livingCost}
                  </InlineReadMore>
                </View>
              )}
              <View style={livingCostWrapperStyle}>
                <CText fontSize={16} lineHeight={30} textAlign="left">
                  {t("plan_your_trip")}
                </CText>
                <View style={flexOneRowCenter}>
                  <TouchableOpacity
                    onPress={openLinkInSafarwayWebview}
                    style={planYourTripButtonStyle}
                  >
                    <Icon
                      name={"hotel"}
                      type={IconTypes.SAFARWAY_ICONS}
                      height={20}
                      width={20}
                      color={theme.colors.text}
                    />
                    <CText fontSize={13} lineHeight={18} fontFamily="light">
                      {t("hotels.title")}
                    </CText>
                  </TouchableOpacity>
                  {!!bestTimeToVisit && bestTimeToVisit.length > 0 && (
                    <TouchableOpacity
                      onPress={handleBestTimeToVisitInfo}
                      style={planYourTripButtonStyle}
                    >
                      <Icon
                        name={"hotel"}
                        type={IconTypes.SAFARWAY_ICONS}
                        height={20}
                        width={20}
                        color={theme.colors.text}
                      />
                      <CText
                        textAlign={"center"}
                        fontSize={13}
                        lineHeight={18}
                        fontFamily="light"
                      >
                        {t("best_month_more")}
                      </CText>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <View>
                <BestMonths
                  handleBestTimeToVisitInfo={handleBestTimeToVisitInfo}
                  bestTimeToVisit={bestTimeToVisit}
                  months={months}
                />
              </View>
              {!!location && (
                <MapPreview
                  initialRegion={initialRegion}
                  containerStyle={mapContainerStyle}
                  markers={markers}
                  minZoomLevel={5}
                  animateToFitMarkers={
                    !(type === DestinationsType.CITY || type === DestinationsType.COUNTRY)
                  }
                  onPress={onMapPreviewPress}
                  scrollEnabled={false}
                  pitchEnabled={false}
                  zoomEnabled={false}
                  zoomTapEnabled={false}
                  rotateEnabled={false}
                  zoomControlEnabled={false}
                  toolbarEnabled={false}
                  showsPointsOfInterest={false}
                  showsBuildings={false}
                  showsCompass={false}
                  showsIndoorLevelPicker={false}
                  showsIndoors={false}
                  showsMyLocationButton={false}
                  showsScale={false}
                  showsTraffic={false}
                />
              )}
              <AdsItem adId={CITY_COUNTRY_REGION_AD.id} config={config} />
            </View>
          </View>
        </TouchableOpacity>
      </>
    );
  }, [
    IMAGES_LENGTH,
    LINEAR_GRADIENT_COLORS,
    actionWrapperParallelStyle,
    backArrowStyle,
    bestTimeToVisit,
    cityCountryRegionTitle,
    country?.code,
    coverImageStyle,
    coverPhoto,
    currency,
    description,
    descriptionWrapperStyle,
    destinationFlagImageStyle,
    destinationTitleStyle,
    destinationTitleTextStyle,
    detailsInfoWrapperStyle,
    dividerStyle,
    flexOneRowCenter,
    flexRowCenter,
    goBackHandler,
    handleBestTimeToVisitInfo,
    handleCopy,
    handleSearchCity,
    handleShare,
    headerIconStyle,
    imageGalleryIconWrapperStyle,
    imagesLengthTextStyle,
    initialRegion,
    isLoadingShare,
    isLoading,
    languageCurrencyContainerStyle,
    languages,
    livingCost,
    livingCostWrapperStyle,
    location,
    mapContainerStyle,
    markers,
    months,
    onMapPreviewPress,
    originalDescription,
    overlayWrapperStyle,
    parallaxBodyBackground,
    parallaxBodyWrapperStyle,
    parallaxHeaderTouchableStyle,
    parallaxHeaderWrapperStyle,
    planYourTripButtonStyle,
    rightHeaderStyle,
    shareIconWrapperStyle,
    showImageGallery,
    t,
    theme.colors.text,
    theme.colors.white,
    translationSource,
    type,
    weather,
    weatherWrapperContainer,
    weatherWrapperStyle
  ]);

  const goBackHandler = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const cityCountryRegionTitle = !!title && title[language];

  const handleKeyExtractor = useCallback((item, index) => `${item?.pkey}-${index}`, []);

  const _rowRenderer = useCallback((type, data) => {
    const item = data;
    const { country, city, featured_image, rate, slug, title, location, pkey } =
      item || {};

    return (
      <PropertyCard
        containerStyle={propertyContainerStyle}
        language={language}
        shouldRenderProgressive={false}
        city={city}
        country={country}
        featured_image={featured_image}
        rate={rate}
        slug={slug}
        title={title}
        location={location}
        pkey={pkey}
      />
    );
  }, []);

  const recycleViewScollProps = useMemo(
    () => ({
      showsHorizontalScrollIndicator: false,
      contentContainerStyle: propertiesScrollViewContainerStyle
    }),
    [propertiesScrollViewContainerStyle]
  );

  const renderRecyclerFooter = useCallback(
    (relatedPropertiesItems, pkey, propertiesTitle, total) => {
      if (relatedPropertiesItems.length < 10) {
        return null;
      }
      return (
        <ViewMorePropertyCard
          pkey={pkey}
          propertiesTitle={propertiesTitle}
          total={total}
          destinationPkey={destinationInfo?.pkey}
          title={title}
          type={type}
        />
      );
    },
    [destinationInfo?.pkey, title, type]
  );

  const renderFlatListItem = useCallback(
    ({ item: relatedProperty, index }) => {
      const { pkey, title: propertiesTitle, total } = relatedProperty;
      if (relatedProperty?.items?.length === 0) {
        return null;
      }

      return (
        <View style={index === 0 && !config && sliderSectionWrapperStyle}>
          <SliderSection
            title={propertiesTitle}
            key={pkey}
            moreText={t("more")}
            moreCallback={handleMorePropertyCallback}
            moreCallbackProperties={relatedProperty}
          >
            <View style={recycleViewStyle}>
              <RecyclerListView
                isHorizontal
                layoutProvider={_layoutProvider}
                dataProvider={dataProvider.cloneWithRows(relatedProperty?.items)}
                rowRenderer={_rowRenderer}
                scrollViewProps={recycleViewScollProps}
                layoutSize={LAYOUT_SIZE}
                renderFooter={() =>
                  renderRecyclerFooter(
                    relatedProperty?.items,
                    pkey,
                    propertiesTitle,
                    total
                  )
                }
              />
            </View>
          </SliderSection>
        </View>
      );
    },
    [
      handleMorePropertyCallback,
      t,
      _rowRenderer,
      recycleViewScollProps,
      recycleViewStyle,
      renderRecyclerFooter,
      sliderSectionWrapperStyle
    ]
  );

  const renderListFooterComponent = useCallback(() => {
    // get articles + reviews

    return (
      <>
        {isRelatedPropertiesLoading && (
          <SliderSection title="">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={propertiesScrollViewContainerStyle}
            >
              {Array.from(Array(3).keys()).map((item, index) => {
                return <ProperyCardSkeleton key={index.toString()} />;
              })}
            </ScrollView>
          </SliderSection>
        )}
        {articles?.length > 0 && (
          <SliderSection title={t("articles")}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={articlesScrollViewContainerStyle}
            >
              {articles?.map((item, index: number) => {
                return (
                  <ArticleCard
                    key={`${item.slug}-${index}`}
                    {...item}
                    analyticsSource={ANALYTICS_SOURCE}
                    language={language}
                    featured_image={{ image_uuid: item.featuredImageUUID }}
                    travelCategories={item.traverCategories}
                    analyticsSource={ANALYTICS_SOURCE}
                  />
                );
              })}
            </ScrollView>
          </SliderSection>
        )}
      </>
    );
  }, [
    articles,
    articlesScrollViewContainerStyle,
    language,
    t,
    isRelatedPropertiesLoading,
    propertiesScrollViewContainerStyle
  ]);

  const handleOnEndReached = useCallback(() => {
    if (!destinationInfo?.pkey || relatedProperties.length > 2) {
      return;
    }

    getRelatedPropertiesByCategoryId();
  }, [relatedProperties, destinationInfo?.pkey, getRelatedPropertiesByCategoryId]);

  const handleOnScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      y.value = event.nativeEvent.contentOffset.y;
    },
    [y]
  );

  if (isLoading) {
    return <CityCountryRegionSkeleton />;
  }

  const animatedStickyHeaderStyles = [animatedStickyHeaderStyle, stickyHeaderStyle];
  return (
    <>
      <Animated.View style={animatedStickyHeaderStyles}>
        <Appbar.BackAction
          style={[stickyHeaderBackIconStyle, { marginTop: insets.top }]}
          color={"white"}
          size={scale(18)}
          onPress={goBackHandler}
        />
        <View style={stickyHeaderTitleWrapperStyle}>
          <CText color="white" fontSize={12} numberOfLines={1} textAlign="center">
            {cityCountryRegionTitle}
          </CText>
        </View>
        <View style={actionsWrapperStyle}>
          {!!IMAGES_LENGTH && (
            <TouchableOpacity
              style={imageGalleryIconWrapperStyle}
              onPress={showImageGallery}
            >
              <Icon
                type={IconTypes.ION_ICONS}
                name="ios-images-outline"
                size={23}
                color={"white"}
              />
              <CText
                color="white"
                fontSize={12}
                style={imagesLengthTextStyle}
              >{`(${IMAGES_LENGTH})`}</CText>
            </TouchableOpacity>
          )}
          {isLoadingShare ? (
            <View style={shareIconWrapperStyle}>
              <ActivityIndicator color={theme.colors.white} size={23} />
            </View>
          ) : (
            <TouchableOpacity style={shareIconWrapperStyle} onPress={handleShare}>
              <Icon type={IconTypes.FONTISTO} name="share" size={20} color={"white"} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
      <FlatList
        data={relatedProperties}
        keyExtractor={handleKeyExtractor}
        renderItem={renderFlatListItem}
        onEndReachedThreshold={0.5}
        onEndReached={handleOnEndReached}
        onScroll={handleOnScroll}
        ListHeaderComponent={renderParallaxHeader}
        ListFooterComponent={renderListFooterComponent}
      />
    </>
  );
};

export default CityCountryRegion;
