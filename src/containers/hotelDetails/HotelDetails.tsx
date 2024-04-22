import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Appbar, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { DataProvider, LayoutProvider, RecyclerListView } from "recyclerlistview";

import hotelDetailsStyles from "./HotelDetails.styles";

import { RootState } from "~/redux/store";

import { reviewAPI } from "~/apis/";
import { ReviewTypes } from "~/apis/review/review.types";
import { HotelProgressStatus } from "~/apiServices/hotels/hotels.types";
import { hotelsService, propertyService } from "~/apiServices/index";
import { Property as PropertyType } from "~/apiServices/property/property.types";
import { Review } from "~/apiServices/review/review.types";
import IMAGES from "~/assets/images";
import {
  AddReviewModal,
  CText,
  HotelCountdown,
  Icon,
  IconTypes,
  InlineReadMore,
  MapPreview,
  modalizeRef,
  ParallaxHeaderScrollView,
  ProgressiveImage,
  RatingBar
} from "~/components/";
import { CountdownVariant } from "~/components/common/Countdown/Countdown.types";
import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import { PropertyCard, ProperyCardSkeleton } from "~/components/home";
import {
  FacilitiesList,
  PackageDetailsCard,
  RoomDetailsCard
} from "~/components/hotelDetails";
import { Room } from "~/components/hotelDetails/RoomDetailsCard/RoomDetailsCard.types";
import { RoomDetailsCardSkeleton } from "~/components/hotelDetails/RoomDetailsCardSkeleton";
import { HotelsSearchAgain } from "~/components/hotels/hotelsSearchAgain";
import { APP_SCREEN_HEIGHT, MOMENT_YYY_MM_DD } from "~/constants/";
import { APP_SCREEN_WIDTH, HORIZONTAL_SLIDER_HEIGHT } from "~/constants/variables";
import { Hotel } from "~/containers/hotelsList/HotelsList.types";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import { upsertProperties } from "~/redux/reducers/favorite.slice";
import { showGalleryViewer } from "~/redux/reducers/galleryViewer.reducer";
import {
  setCalendarDates,
  setCalendarTempDates,
  setCountOfNights,
  setHotelsSRK,
  setHotelsTokens,
  setRooms as setRoomsReducer
} from "~/redux/reducers/hotels.reducer";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import { AppStackRoutesHotelDetailsProps } from "~/router/AppStackRoutes/AppStackRoutes.type";
import {
  CALENDAR_CLOSED,
  HOTEL_MAP_OPENED,
  HOTEL_SHARE_FAILED,
  HOTEL_SHARE_INITIATED,
  HOTEL_SHARE_SUCCESS,
  logEvent,
  ROOMS_UPDATED
} from "~/services/analytics";
import {
  DynamicLinksAction,
  handleCreateShareLink,
  showShareView
} from "~/services/rnFirebase/dynamicLinks";
import { translate } from "~/translations/";
import { logError, scale, verticalScale } from "~/utils/";
import { normalizeByKey } from "~/utils/reduxUtil";

const dataProvider = new DataProvider((r1, r2) => {
  return r1.pkey !== r2.pkey;
});

const CARD_WIDTH = 156;
const _layoutProvider = new LayoutProvider(
  index => {
    return index;
  },
  (type, dim) => {
    dim.width = CARD_WIDTH;
    dim.height = HORIZONTAL_SLIDER_HEIGHT;
  }
);
const LAYOUT_SIZE = {
  height: HORIZONTAL_SLIDER_HEIGHT,
  width: APP_SCREEN_WIDTH
};

const INLNE_READMORE_TEXT_PROPS = {
  fontFamily: "thin",
  style: {
    lineHeight: 26
  }
};
const ANALYTICS_SOURCE = "hotel_details_page";

const HotelDetails = (props: AppStackRoutesHotelDetailsProps) => {
  const { route } = props;
  const {
    updateHotelsCb,
    hotel: initialHotel = undefined,
    hotelIndex,
    searchParams,
    searchTerm = "",
    filters = []
  } = route.params || {};

  const navigation = useNavigation();
  const { t } = useTranslation();
  const theme = useTheme();
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const insets = useSafeAreaInsets();
  const [hotel, setHotel] = useState<Hotel>(initialHotel);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filterOptions, setFilterOptions] = useState([]);
  const [selectedRoomFilters, setSelectedRoomFilters] = useState([]);
  const [isLoadingShare, setIsLoadingShare] = useState(false);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [isReviewed, setIsReviewed] = useState(false);
  const [relatedProperties, setRelatedProperties] = useState<PropertyType[]>([]);
  const [isRelatedPropertiesLoading, setisRelatedPropertiesLoading] = useState(true);

  const payload = useSelector(
    (state: RootState) => state.hotels.hotelsPayload,
    shallowEqual
  );

  const language = useSelector(
    (state: RootState) => state.settings.language,
    shallowEqual
  );
  const userToken = useSelector((state: RootState) => state?.auth?.userToken);

  const resultsToken = useSelector((state: RootState) => state.hotels.resultsToken);

  const srkToken = useSelector((state: RootState) => state.hotels.srk);
  const checkIn = useSelector((state: RootState) => state.hotels.calendarPayload.checkin);
  const checkOut = useSelector(
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

  const parallaxHeaderHeight = verticalScale(260);
  const HeaderHeight = verticalScale(40) + insets.top;
  const { stars = 0, reviews = null } = hotel ?? {};

  const recyclerWidth = useMemo(
    () => Math.min(relatedProperties.length * CARD_WIDTH, APP_SCREEN_WIDTH),
    [relatedProperties.length]
  );

  const {
    safeAreaViewStyle,
    backIconStyle,
    stickyHeaderWrapperStyle,
    stickyHeaderBackIconStyle,
    stickyHeaderTitleWrapperStyle,
    shareIconWrapperStyle,
    parallaxHeaderWrapperStyle,
    parallaxHeaderTouchableStyle,
    overlayWrapperStyle,
    coverImageStyle,
    containerStyle,
    countDownStyle,
    ratingBarStyle,
    marginBottom5,
    filtersRowStyle,
    rowWithVerticalMargin,
    row,
    offerEndRow,
    startingPriceTextStyle,
    mapContainerStyle,
    descriptionWrapperStyle,
    recycleViewStyle,
    contentContainerStyle,
    sliderTitleTextStyle,
    sliderWrapperStyle
  } = useMemo(
    () => hotelDetailsStyles(theme, insets, parallaxHeaderHeight, recyclerWidth),
    [theme, insets, parallaxHeaderHeight, recyclerWidth]
  );

  useEffect(() => {
    let offers = {};

    hotelsService
      .getHotel(srkToken, hotelIndex, resultsToken)
      .then(res => {
        const location = {
          lat: parseFloat(res?.geolocation?.latitude || "0"),
          lon: parseFloat(res?.geolocation?.longitude || "0")
        };
        setHotel({
          ...hotel,
          ...res,
          location
        });
        return propertyService.getPropertiesByLocation(location, 15);

        // setIsReviewed(res.is_reviewed);
      })
      .then(async (nearbyRes = []) => {
        const optimizedProperties = nearbyRes?.reduce(normalizeByKey("pkey"), {});

        dispatch(upsertProperties(optimizedProperties));
        // setRelatedProperties(nearbyRes.filter(nearByProp => nearByProp.slug !== slug));
        setRelatedProperties(nearbyRes);
        // await logEvent(PROPERTY_GET_PROPERTIES_BY_LOCATION_SUCCESS, analyticsProps);
        return hotelsService.getHotelOffers(srkToken, hotelIndex, resultsToken);
      })
      .then(data => {
        offers = data;
        const offerIds = [];
        const packagesOffers = data.offers;
        for (let index = 0; index < data?.offers?.length; index++) {
          const offer = data?.offers[index];
          offerIds.push(offer.id);
        }

        return Promise.all(
          offerIds?.map(offerId => {
            return hotelsService.getRooms(srkToken, hotelIndex, resultsToken, offerId);
          })
        );
      })
      .then(data => {
        const rooms = data.flat();

        const offersRoomCombined = offers?.offers?.map(offer => {
          const extendedRooms = offer?.rooms?.map(room => {
            const roomOffer = rooms.find(
              innerRoom =>
                innerRoom.offerId === offer.id && innerRoom.index === room.index
            );
            return {
              offerId: offer?.id,
              ...room,
              ...roomOffer
            };
          });
          return {
            ...offer,
            rooms: extendedRooms
          };
        });

        const packagesWithRoomsExtended = offersRoomCombined
          ?.map(offerWithRoom => {
            const roomReferenceForOfferWithRoom = offerWithRoom?.rooms ?? [];

            const packagesWithRooms = offerWithRoom?.packages?.map(packageHotel => {
              const packageRoomsExtended = packageHotel?.packageRooms?.map(
                packageRoom => {
                  const roomReferencesExtended = packageRoom?.roomReferences?.map(
                    roomReference => {
                      const packageFindRoom = roomReferenceForOfferWithRoom?.find(
                        room => room.index === String(roomReference.roomCode)
                      );
                      if (!packageFindRoom.price) {
                        packageFindRoom.price = packageHotel?.price;
                      }
                      return {
                        ...packageFindRoom,
                        ...roomReference,
                        packageToken: packageHotel.packageToken
                      };
                    }
                  );
                  return {
                    ...packageRoom,
                    roomReferences: { ...roomReferencesExtended }
                  };
                }
              );
              return { ...packageHotel, packageRooms: packageRoomsExtended };
            });

            return packagesWithRooms;
          })
          .flat()
          .sort((a, b) => {
            const priceA = a?.price?.selling?.value;
            const priceB = b?.price?.selling?.value;
            if (priceA < priceB) {
              return -1;
            }
            if (priceA > priceB) {
              return 1;
            }
            // a must be equal to b
            return 0;
          });
        setRooms(packagesWithRoomsExtended);
      })
      .catch(err => {
        logError(
          `Error: getHotel/getPropertiesByLocation/getRooms/getHotelOffers --HotelDetails.tsx-- ${err}`
        );
      })
      .finally(() => {
        setisRelatedPropertiesLoading(false);
        setIsLoadingRooms(false);
      });

    // reviewService.getContentReviews(hotel?.id, 3).then(res => {
    //   const newUsers = res?.Items.map(review => {
    //     const { country, profileImage, profile, ...restOfProps } =
    //       review?.created_by ?? {};

    //     return {
    //       ...restOfProps,
    //       country_code: country?.id,
    //       country: country?.name,
    //       id: restOfProps.uuid,
    //       profile_image: profileImage,
    //       profile: profile
    //     };
    //   });

    //   dispatch(loadNewUsers(newUsers));
    //   setUserReviews(res?.Items || []);
    // });
  }, []);

  const restartSearch = useCallback(
    payloadParam => {
      let offers = {};
      hotelsService
        .searchHotels(payloadParam)
        .then(async searchRes => {
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
              hotelsService
                .resultsHotelsSearch(
                  progressResult.srk,
                  searchRes.tokens.results,
                  filters,
                  1,
                  10
                )
                .then(res => {
                  updateHotelsCb(res.hotels);
                })
                .catch(error =>
                  logError(
                    `Error: resultsHotelsSearch --HotelDetails.tsx-- srk=${progressResult.srk} ${error}`
                  )
                );
              hotelsService
                .getHotelOffers(progressResult.srk, hotelIndex, searchRes.tokens.results)
                .then(data => {
                  offers = data;
                  const offerIds = [];
                  const packagesOffers = data.offers;
                  for (let index = 0; index < data?.offers?.length; index++) {
                    const offer = data?.offers[index];
                    offerIds.push(offer.id);
                  }

                  return Promise.all(
                    offerIds?.map(offerId => {
                      return hotelsService.getRooms(
                        progressResult.srk,
                        hotelIndex,
                        searchRes.tokens.results,
                        offerId
                      );
                    })
                  );
                })
                .then(data => {
                  const rooms = data.flat();

                  const offersRoomCombined = offers?.offers?.map(offer => {
                    const extendedRooms = offer?.rooms?.map(room => {
                      const roomOffer = rooms.find(
                        innerRoom =>
                          innerRoom.offerId === offer.id && innerRoom.index === room.index
                      );
                      return {
                        ...room,
                        ...roomOffer
                      };
                    });
                    return {
                      ...offer,
                      rooms: extendedRooms
                    };
                  });

                  const packagesWithRoomsExtended = offersRoomCombined
                    ?.map(offerWithRoom => {
                      const roomReferenceForOfferWithRoom = offerWithRoom?.rooms ?? [];

                      const packagesWithRooms = offerWithRoom?.packages?.map(
                        packageHotel => {
                          const packageRoomsExtended = packageHotel?.packageRooms?.map(
                            packageRoom => {
                              const roomReferencesExtended =
                                packageRoom?.roomReferences?.map(roomReference => {
                                  const packageFindRoom =
                                    roomReferenceForOfferWithRoom?.find(
                                      room =>
                                        room.index === String(roomReference.roomCode)
                                    );
                                  if (!packageFindRoom.price) {
                                    packageFindRoom.price = packageHotel?.price;
                                  }
                                  return {
                                    ...packageFindRoom,
                                    ...roomReference,
                                    packageToken: packageHotel.packageToken
                                  };
                                });
                              return {
                                ...packageRoom,
                                roomReferences: { ...roomReferencesExtended }
                              };
                            }
                          );
                          return { ...packageHotel, packageRooms: packageRoomsExtended };
                        }
                      );

                      return packagesWithRooms;
                    })
                    .flat()
                    .sort((a, b) => {
                      const priceA = a?.price?.selling?.value;
                      const priceB = b?.price?.selling?.value;
                      if (priceA < priceB) {
                        return -1;
                      }
                      if (priceA > priceB) {
                        return 1;
                      }
                      // a must be equal to b
                      return 0;
                    });
                  setRooms(packagesWithRoomsExtended);
                })
                .catch(err => {
                  setRooms([]);
                  logError(
                    `Error: getHotel/getPropertiesByLocation/getRooms/getHotelOffers --HotelDetails.tsx-- ${err}`
                  );
                })
                .finally(() => {
                  setisRelatedPropertiesLoading(false);
                  setIsLoadingRooms(false);
                });
              stopped = true;
              finalProgressResult = progressResult;
              await dispatch(setHotelsSRK(progressResult.srk));
            }
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
          logError(`Error: searchHotels --HotelsListView.tsx-- ${error}`);
        });
    },
    [colors.darkRed, dispatch, hotelIndex, filters, updateHotelsCb]
  );

  const handleDateSaved = useCallback(
    (tempCheckin, tempCheckout) => {
      modalizeRef.current?.close();

      setIsLoadingRooms(true);
      if (tempCheckin.isSameOrAfter(tempCheckout)) {
        dispatch(
          setCalendarDates({
            checkin: tempCheckin,
            checkout: moment(tempCheckin).add(1, "day")
          })
        );
        payload.checkIn = tempCheckin.format(MOMENT_YYY_MM_DD);
        payload.checkOut = moment(tempCheckin).add(1, "day").format(MOMENT_YYY_MM_DD);
        restartSearch(payload);
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
      restartSearch(payload);
      return logEvent(CALENDAR_CLOSED, { source: ANALYTICS_SOURCE });
    },
    [dispatch, restartSearch, payload]
  );

  const handleRoomSelected = useCallback(
    async roomsData => {
      await logEvent(ROOMS_UPDATED, {
        source: ANALYTICS_SOURCE,
        selected_rooms_data: roomsData
      });
      modalizeRef.current?.close();
      setIsLoadingRooms(true);
      dispatch(setRoomsReducer({ rooms: roomsData }));
      payload.checkIn = moment(checkIn).format(MOMENT_YYY_MM_DD);
      payload.checkOut = moment(checkOut).format(MOMENT_YYY_MM_DD);
      payload.occupancy.rooms = roomsData;
      restartSearch(payload);
    },
    [checkIn, checkOut, dispatch, payload, restartSearch]
  );

  const renderStickyHeader = useCallback(() => {
    return (
      <View style={stickyHeaderWrapperStyle}>
        <Appbar.BackAction
          style={stickyHeaderBackIconStyle}
          color={"white"}
          size={scale(18)}
          onPress={navigation.goBack}
        />
        <View style={stickyHeaderTitleWrapperStyle}>
          <CText color="white" fontSize={16} numberOfLines={1} textAlign="center">
            {hotel?.name}
          </CText>
        </View>
      </View>
    );
  }, [
    hotel?.name,
    navigation.goBack,
    stickyHeaderBackIconStyle,
    stickyHeaderTitleWrapperStyle,
    stickyHeaderWrapperStyle
  ]);

  const handleSharePressed = useCallback(async () => {
    const rating: number = stars > 0 && stars < 6 ? stars : 0;

    const shareParams = {
      action: DynamicLinksAction.HOTEL,
      title: hotel?.name,
      description: t("hotels.share_details", {
        address: searchTerm,
        stars: t("star", { count: rating })
      }),
      image: hotel?.image,
      params: {
        ...searchParams,
        latitude: hotel?.geo_location?.latitude || hotel?.location?.lat,
        longitude: hotel?.geo_location?.longitude || hotel?.location?.lon,
        hotelId: hotel?.id
      }
    };

    await logEvent(HOTEL_SHARE_INITIATED, {
      source: ANALYTICS_SOURCE,
      ...shareParams
    });

    setIsLoadingShare(true);
    handleCreateShareLink({ ...shareParams })
      .then(link => {
        showShareView(link);
      })
      .then(shareRes =>
        logEvent(HOTEL_SHARE_SUCCESS, {
          source: ANALYTICS_SOURCE,
          ...shareParams,
          ...shareRes
        })
      )
      .catch(error => {
        logEvent(HOTEL_SHARE_FAILED, { source: ANALYTICS_SOURCE, ...shareParams });
        logError(
          `Error: handleSharePressed --HotelDetails.tsx-- Error=${error} hotel_id: ${hotel?.id} `
        );
      })
      .finally(() => {
        setIsLoadingShare(false);
      });
  }, [
    hotel?.geo_location?.latitude,
    hotel?.geo_location?.longitude,
    hotel?.id,
    hotel?.image,
    hotel?.location?.lat,
    hotel?.location?.lon,
    hotel?.name,
    searchParams,
    searchTerm,
    stars,
    t
  ]);

  const showImageGallery = useCallback(() => {
    const { images: BTravelImages = [] } = hotel || {};
    const gallery = Object.values(BTravelImages);

    const images = gallery?.map(galleryImage => ({
      uri: galleryImage?.url?.replace("http://", "https://") ?? ""
    }));

    dispatch(
      showGalleryViewer({
        data: images,
        isVisible: true,
        disableThumbnailPreview: false,
        currentIndex: 0,
        sourceType: "",
        sourceIdentifier: ""
      })
    );
  }, [dispatch, hotel]);

  const renderParallaxHeader = useCallback(() => {
    // if no hotel is yet loaded we show empty image so that it's loading
    const imageUri = hotel?.mainImage?.url
      ? { uri: hotel?.mainImage?.url?.replace("http://", "https://") }
      : !hotel
      ? ""
      : IMAGES.default_hotel;
    return (
      <TouchableOpacity onPress={showImageGallery} style={parallaxHeaderWrapperStyle}>
        <TouchableOpacity onPress={showImageGallery} style={parallaxHeaderTouchableStyle}>
          {!!imageUri && (
            <ProgressiveImage
              style={coverImageStyle}
              resizeMode={"cover"}
              thumbnailSource={imageUri}
              source={imageUri}
              errorSource={imageUri}
            />
          )}
        </TouchableOpacity>
        <View style={overlayWrapperStyle} />
        {/* {isLoadingShare ? (
          <View style={shareIconWrapperStyle}>
            <ActivityIndicator color={theme.colors.white} size={23} />
          </View>
        ) : (
          <TouchableOpacity onPress={handleSharePressed} style={shareIconWrapperStyle}>
            <Icon type={IconTypes.FONTISTO} name="share" size={20} color={"white"} />
          </TouchableOpacity>
        )} */}
      </TouchableOpacity>
    );
  }, [
    coverImageStyle,
    handleSharePressed,
    hotel?.mainImage?.url,
    isLoadingShare,
    overlayWrapperStyle,
    parallaxHeaderTouchableStyle,
    parallaxHeaderWrapperStyle,
    shareIconWrapperStyle,
    showImageGallery,
    theme.colors.white
  ]);

  const onSubmitReview = ({ text, rating, uploadedImageIds }) => {
    return reviewAPI
      .addReview({
        text,
        pkey: hotel?.hotel_id,
        rate: rating,
        type: "hotel",
        gallery: uploadedImageIds.length
          ? uploadedImageIds.map(item => ({ id: item }))
          : null
      })
      .then(({ data }) => {
        setUserReviews(prev => [...prev, data]);
        setIsReviewed(true);
      });
  };

  const onAddReviewPress = () => {
    if (!userToken) {
      return navigation.navigate("PreLoginNavigationModal");
    }
    dispatch(
      showBottomSheet({
        Content: () => (
          <AddReviewModal onSubmit={onSubmitReview} name={hotel?.name} withStars />
        ),
        customProps: {},
        props: {
          modalHeight: APP_SCREEN_HEIGHT,
          closeOnOverlayTap: true,
          panGestureEnabled: false,
          withoutHeaderMargin: true,
          withHandle: false,
          fullScreen: true
        }
      })
    );
  };

  function updateReview(newReview: Review) {
    setUserReviews(
      userReviews?.map(review => {
        if (review?.index !== newReview.index) {
          return review;
        }
        return {
          ...review,
          ...newReview
        };
      })
    );
  }

  function deleteReview(newIndex: string) {
    setIsReviewed(false);
    setUserReviews(userReviews?.filter(item => item?.index !== newIndex));
  }

  const onShowMorePress = () => {
    navigation.navigate("Reviews", {
      hotelId: hotel.hotel_id,
      withStars: true,
      name: hotel.name,
      isReviewed,
      setIsReviewed,
      reviewsType: ReviewTypes.HOTEL,
      parentReviews: userReviews,
      setParentReviews: setUserReviews,
      rate: hotel?.rate
    });
  };

  const onMapPreviewPress = useCallback(async () => {
    await logEvent(HOTEL_MAP_OPENED, {
      source: ANALYTICS_SOURCE,
      hotel_id: hotel?.id,
      hotel_name: hotel?.name
    });

    const { location } = hotel || {};

    return navigation.navigate("MapView", {
      initialRegion: {
        latitude: location?.lat,
        longitude: location?.lon,
        latitudeDelta: location?.latDelta ?? 0.005,
        longitudeDelta: location?.lonDelta ?? 0.005
      },
      markers: [
        {
          identifier: "Marker1",
          latitude: location?.lat,
          longitude: location?.lon
        }
      ]
    });
  }, [navigation, hotel?.location]);

  const initialRegion = useMemo(() => {
    return {
      latitude: parseFloat(hotel?.location?.lat),
      longitude: parseFloat(hotel?.location?.lon),
      latitudeDelta: parseFloat(hotel?.location?.latDelta || 0.005),
      longitudeDelta: parseFloat(hotel?.location?.lonDelta || 0.005)
    };
  }, [
    hotel?.location?.lat,
    hotel?.location?.lon,
    hotel?.location?.latDelta,
    hotel?.location?.lonDelta
  ]);

  const markers = useMemo(
    () => [
      {
        identifier: "Marker1",
        latitude: hotel?.location?.lat,
        longitude: hotel?.location?.lon
      }
    ],
    [hotel?.location?.lat, hotel?.location?.lon]
  );

  const recycleViewScollProps = useMemo(
    () => ({ showsHorizontalScrollIndicator: false }),
    []
  );

  const _dataProvider = useMemo(() => {
    const optimizedRelatedProps = relatedProperties.map(item => ({
      pkey: item.pkey,
      city: item.city,
      country: item.country,
      featured_image: item.featured_image,
      rate: item.rate,
      slug: item.slug,
      title: item.title,
      location: item.location
    }));

    return dataProvider.cloneWithRows(optimizedRelatedProps);
  }, [relatedProperties]);

  const _rowRenderer = useCallback(
    (type, data) => {
      const item = data;

      return (
        <PropertyCard
          {...item}
          language={language}
          referenceLocation={hotel?.location}
          shouldRenderProgressive={false}
          country={item?.country?.name ?? ""}
          city={item?.city?.name ?? ""}
          analyticsSource={ANALYTICS_SOURCE}
        />
      );
    },
    [language, hotel?.location]
  );

  const { descriptions, name = "", image = {} } = hotel || {};
  const { full: fullDescription = "" } = descriptions || {};
  const packageDetailsCardImage = image?.url ? { uri: image?.url } : IMAGES.default_hotel;

  return (
    <View style={safeAreaViewStyle}>
      <Appbar.BackAction
        style={backIconStyle}
        color={"white"}
        size={scale(18)}
        onPress={navigation.goBack}
      />
      <ParallaxHeaderScrollView
        parallaxHeaderHeight={parallaxHeaderHeight}
        stickyHeaderHeight={HeaderHeight}
        parallaxHeader={renderParallaxHeader}
        stickyHeader={renderStickyHeader}
      >
        <View style={containerStyle}>
          <View>
            <CText>{name}</CText>
            {!!stars && (
              <View style={rowWithVerticalMargin}>
                <CText color={"gray"} fontSize={12} lineHeight={14}>
                  {`${t("hotels.hotel_stars")}:`}
                </CText>
                <RatingBar
                  ratingCount={5}
                  defaultValue={stars}
                  size={scale(18)}
                  disabled
                  containerStyle={ratingBarStyle}
                />
              </View>
            )}
            {reviews && (
              <CText color={"gray"} fontSize={12} lineHeight={14}>
                {`${t("hotels.hotel_rating")}: ${reviews?.rating || 0}/10`}
              </CText>
            )}
            {!!fullDescription && (
              <View style={descriptionWrapperStyle}>
                <InlineReadMore
                  maxNumberOfLinesToShow={5}
                  isAutoLink
                  textProps={INLNE_READMORE_TEXT_PROPS}
                  analyticsSource={ANALYTICS_SOURCE}
                  type={"hotel"}
                  pkey={hotel?.id}
                  index={hotel?.id}
                >
                  {fullDescription}
                </InlineReadMore>
              </View>
            )}
            <FacilitiesList facilities={hotel?.facilities} />
            {!!hotel?.location && (
              <MapPreview
                initialRegion={initialRegion}
                containerStyle={mapContainerStyle}
                markers={markers}
                minZoomLevel={5}
                animateToFitMarkers={true}
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
            <View style={offerEndRow}>
              <View style={row}>
                <CText style={startingPriceTextStyle} color={"text"} fontSize={11}>
                  {t("offer_ends_in")}
                </CText>
                <HotelCountdown variant={CountdownVariant.WITH_TEXT} />
              </View>
              {rooms.length > 0 && (
                <View style={rowWithVerticalMargin}>
                  <CText style={startingPriceTextStyle} fontSize={12} lineHeight={17}>
                    {t("hotels.starting_price")}
                  </CText>
                  <View style={row}>
                    <CText
                      color={"primary_reversed"}
                      fontSize={17}
                      fontFamily={"medium"}
                      lineHeight={22}
                    >
                      {` ${rooms[0]?.price?.selling?.value} `}
                    </CText>
                    <CText color={"primary_reversed"} fontSize={12} lineHeight={17}>
                      {rooms[0]?.price?.selling?.currency}
                    </CText>
                  </View>
                </View>
              )}
            </View>
            <HotelsSearchAgain
              handleRoomSelected={handleRoomSelected}
              handleDateSaved={handleDateSaved}
              analyticsSource={ANALYTICS_SOURCE}
            />
            <View style={filtersRowStyle}>
              <CText style={marginBottom5}>{`${t("hotels.rooms")} (${
                rooms?.length
              })`}</CText>
            </View>
            {isLoadingRooms ? (
              <>
                <RoomDetailsCardSkeleton />
                <RoomDetailsCardSkeleton />
              </>
            ) : rooms.length > 0 ? (
              rooms.map((room, index) => {
                const key = `${room?.packageRooms[0]?.roomReferences[0]?.roomToken}-${index}`;

                return roomsDetails.length > 1 ? (
                  <PackageDetailsCard
                    image={packageDetailsCardImage}
                    index={index}
                    packageParam={room}
                    key={key}
                    hotel={hotel}
                    analyticsSource={ANALYTICS_SOURCE}
                  />
                ) : (
                  <RoomDetailsCard
                    room={room}
                    key={key}
                    hotel={hotel}
                    analyticsSource={ANALYTICS_SOURCE}
                  />
                );
              })
            ) : (
              <CText fontSize={16} lineHeight={20}>
                {t("no_results_found")}
              </CText>
            )}
          </View>
        </View>
        {(isRelatedPropertiesLoading || relatedProperties.length > 0) && (
          <View style={sliderWrapperStyle}>
            <CText fontSize={16} style={sliderTitleTextStyle}>
              {t("nearby_landmarks")}
            </CText>
            {isRelatedPropertiesLoading ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={contentContainerStyle}
              >
                {Array.from(Array(3).keys()).map((item, index) => {
                  return <ProperyCardSkeleton key={index.toString()} />;
                })}
              </ScrollView>
            ) : (
              <View style={recycleViewStyle}>
                <RecyclerListView
                  isHorizontal
                  layoutProvider={_layoutProvider}
                  dataProvider={_dataProvider}
                  rowRenderer={_rowRenderer}
                  scrollViewProps={recycleViewScollProps}
                  layoutSize={LAYOUT_SIZE}
                />
              </View>
            )}
          </View>
        )}

        {/*  <View style={rowWithVerticalMargin}>
          <CText fontSize={14} lineHeight={18} style={iconStyle}>
            {t("reviews")}
          </CText>
          {!isReviewed && (
            <TouchableOpacity style={reviewButtonContainer} onPress={onAddReviewPress}>
              <CText lineHeight={17} fontSize={12} color="white">
                {t("add_review")}
              </CText>
            </TouchableOpacity>
          )}
        </View>
        {userReviews.map((review, index) => (
          <ReviewCard
            title={hotel.name}
            key={`${review.index}-${review.text}-${review.rate}-${
              review?.gallery?.map(image => image.id)?.join(",") ?? ""
            }}`}
            item={review}
            index={index}
            itemsLength={userReviews.length}
            withStars
            onEditCb={updateReview}
            onDeleteCb={deleteReview}
            analyticsType={ReviewCardAnalyticsTypes.HOTEL}
            reviewSource={hotel?.hotel_id}
          />
        ))}
        {userReviews.length >= 3 && (
          <View style={moreButtonStyle}>
            <RPButton
              style={moreButtonWrapperStyle}
              labelStyle={moreButtonLabelStyle}
              onPress={onShowMorePress}
            >
              {t("more")}
            </RPButton>
          </View>
        )} */}
      </ParallaxHeaderScrollView>
    </View>
  );
};

export default memo(HotelDetails);
