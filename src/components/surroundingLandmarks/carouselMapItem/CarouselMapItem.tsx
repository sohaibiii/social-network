import React, { FC, memo } from "react";
import { TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import Config from "react-native-config";
import FastImage from "react-native-fast-image";
import { useTheme, Card } from "react-native-paper";
import { batch, useDispatch, useSelector } from "react-redux";

import carouselMapItemStyle from "./carouselMapItem.styles";
import { CarouselMapItemProps } from "./carouselMapItem.types";

import { RootState } from "~/redux/store";

import { hotelsService } from "~/apiServices/index";
import IMAGES from "~/assets/images";
import { CText, RatingBar, IconTypes, Icon } from "~/components/";
import { RatingComponentTypes } from "~/components/common/RatingBar/RatingComponent/RatingComponent.types";
import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import { getFavouriteListProps } from "~/containers/favoriteList/favouriteList.types";
import { setSelectFavouritemPkey } from "~/redux/reducers/favorite.slice";
import { hideOverlay, showOverlay } from "~/redux/reducers/overlayLoader.reducer";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import {
  checkIsFavouriteThunk,
  getFavouriteListThunk
} from "~/redux/thunk/favorite.thunk";
import { logEvent, NAVIGATE_TO_PROPERTY, PROPERTY_FAVORITE_PRESSED } from "~/services/";
import { getDistanceBetweenLocations } from "~/services/location";
import { translate } from "~/translations/swTranslator";
import { generalErrorHandler, getFormattedGuests, scale } from "~/utils/";
import { thunkDispatch } from "~/utils/reduxUtil";

const CarouselMapItem: FC<CarouselMapItemProps> = props => {
  const { item, location, isHotel, country: userCountry, setIsVisible } = props;

  const {
    featured_image,
    title,
    location: propertyLocation,
    rate,
    city,
    region,
    star_rating,
    country,
    pkey,
    is_favorite: isFavourite
  } = item;

  const { colors } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {
    containerStyle,
    root,
    imageStyle,
    container,
    nameContainer,
    flexStyle,
    ratingStyle
  } = carouselMapItemStyle;

  const language = useSelector((state: RootState) => state.settings.language || "ar");
  const userToken = useSelector((state: RootState) => state.auth.userToken);

  const getFavouriteList = ({ reset, skey }: getFavouriteListProps) => {
    thunkDispatch(getFavouriteListThunk({ reset, skey })).catch(error => {
      dispatch(
        showSnackbar({
          text: translate("something_went_wrong"),
          type: SnackbarVariations.TOAST,
          duration: 2000,
          backgroundColor: "red"
        })
      );
    });
  };

  const onFavouritePress = async () => {
    if (!userToken) {
      return navigation.navigate("PreLoginNavigationModal");
    }
    await logEvent(PROPERTY_FAVORITE_PRESSED, {
      source: "surrounding_landmarks_page",
      pkey
    });

    batch(() => {
      dispatch(setSelectFavouritemPkey(pkey));
      getFavouriteList({ skey: undefined, reset: true });
      thunkDispatch(checkIsFavouriteThunk(pkey)).finally(() => {
        setIsVisible(true);
      });
    });
  };

  const handleGoToHotel = async () => {
    dispatch(showOverlay({ visible: true, backgroundColor: colors.overlay }));
    try {
      const {
        session,
        search: searchParams,
        created_at
      } = await hotelsService.searchHotels({
        type: "distance",
        radius: 10000,
        latitude: item?.location.lat || 0,
        longitude: item.location.lon || 0,
        checkin: moment().locale("en").format("Y-MM-DD"),
        checkout: moment().add(1, "day").locale("en").format("Y-MM-DD"),
        guests: getFormattedGuests([
          {
            Adults: 1,
            Children: 0,
            ChildAge: [],
            room: 0
          }
        ]),
        country: userCountry,
        currency: "USD",
        local: "ar",
        limit: 10,
        offset: 0,
        extras: "hotel_path,facilities",
        filters: "filter_facility_room,filter_facility_hotel,filter_rating"
      });

      navigation.navigate("HotelDetails", {
        searchParams: {
          ...searchParams,
          session
        },
        hotel: item
      });
    } catch (e) {
      generalErrorHandler(e);
    } finally {
      dispatch(hideOverlay());
    }
  };

  const handleGoToProperty = async () => {
    if (isHotel) {
      return handleGoToHotel();
    }
    await logEvent(NAVIGATE_TO_PROPERTY, {
      source: "surrounding_landmarks_page",
      slug: item.slug
    });
    return navigation.navigate({
      name: "Property",
      key: `${moment().unix()}`,
      params: {
        slug: item.slug
      }
    });
  };

  const locationName = `${city?.name ?? ""} ${
    city?.name && region?.name
      ? `- ${region?.name ?? ""}`
      : region?.name ?? country?.name ?? ""
  }`;

  const rating = rate?.rate_calculated || star_rating;

  return (
    <Card style={containerStyle} onPress={handleGoToProperty}>
      <View style={root(colors)}>
        {featured_image?.image_uuid || !isHotel ? (
          <FastImage
            source={{
              uri: !isHotel
                ? `${Config.CONTENT_MEDIA_PREFIX}/${featured_image?.image_uuid}_sm.jpg`
                : `${Config.HOTELS_MEDIA_PREFIX}/${featured_image?.image_uuid}.jpeg`
            }}
            style={imageStyle}
          />
        ) : (
          <FastImage source={IMAGES.default_hotel} style={imageStyle} />
        )}
        <View style={container}>
          <View style={nameContainer}>
            <CText numberOfLines={1} fontSize={14} style={flexStyle}>
              {title[language]}
            </CText>
            {!isHotel && (
              <TouchableOpacity onPress={onFavouritePress}>
                <Icon
                  type={IconTypes.MATERIAL_ICONS}
                  name={"favorite"}
                  size={scale(24)}
                  color={isFavourite ? colors.red : colors.gray}
                />
              </TouchableOpacity>
            )}
          </View>
          <CText numberOfLines={1} fontSize={14} fontFamily="light">
            {getDistanceBetweenLocations(propertyLocation, {
              lat: location.latitude,
              lon: location.longitude
            })}{" "}
            {translate("km")}
          </CText>
          {rating ? (
            <RatingBar
              ratingCount={5}
              defaultValue={Number(rating)}
              type={RatingComponentTypes.STAR}
              size={20}
              disabled
              containerStyle={ratingStyle}
            />
          ) : null}
          <CText numberOfLines={1} fontSize={12} fontFamily="light">
            {locationName}
          </CText>
        </View>
      </View>
    </Card>
  );
};

export default memo(CarouselMapItem);
