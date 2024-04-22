import React, { useEffect, useState, useCallback, useMemo, memo } from "react";
import { View, Pressable } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  Extrapolate,
  interpolate
} from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";

import styles from "./Favourite.styles";
import { FavouriteType } from "./Favourite.types";

import { RootState } from "~/redux/store";

import { Icon, IconTypes } from "~/components/common";
import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import { FavoriteItemModal } from "~/containers/favoriteList";
import { getFavouriteListProps } from "~/containers/favoriteList/favouriteList.types";
import { setSelectFavouritemPkey } from "~/redux/reducers/favorite.slice";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import {
  checkIsFavouriteThunk,
  getFavouriteListThunk
} from "~/redux/thunk/favorite.thunk";
import { logEvent, PROPERTY_FAVORITE_PRESSED } from "~/services/";
import { moderateScale } from "~/utils/";
import { thunkDispatch } from "~/utils/reduxUtil";

const Favourite = (props: FavouriteType): JSX.Element => {
  const theme = useTheme();
  const {
    isFavorite: initialIsFavourite = false,
    color = theme.colors.white,
    selectedColor = "#FF0000",
    pkey,
    size = moderateScale(25)
  } = props;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const userToken = useSelector((state: RootState) => state.auth.userToken);
  const [isVisible, setIsVisible] = useState(false);
  const liked = useSharedValue(Number(initialIsFavourite)); // gives 1 and 0

  useEffect(() => {
    liked.value = withSpring(initialIsFavourite ? 1 : 0);
  }, [initialIsFavourite, liked]);

  const outlineStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      transform: [
        {
          scale: interpolate(liked.value, [0, 1], [1, 0], Extrapolate.CLAMP)
        }
      ]
    };
  });

  const fillStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: liked.value
        }
      ],
      opacity: liked.value
    };
  });

  const getFavouriteList = useCallback(
    ({ reset, skey }: getFavouriteListProps) => {
      thunkDispatch(getFavouriteListThunk({ reset, skey })).catch(error => {
        dispatch(
          showSnackbar({
            text: t("something_went_wrong"),
            type: SnackbarVariations.TOAST,
            duration: 2000,
            backgroundColor: "red"
          })
        );
      });
    },
    [dispatch, t]
  );

  const onFavouritePress = useCallback(async () => {
    await logEvent(PROPERTY_FAVORITE_PRESSED, {
      source: "favorite_items_header_dialog",
      pkey
    });

    if (!userToken) {
      return navigation.navigate("PreLoginNavigationModal");
    }

    thunkDispatch(checkIsFavouriteThunk(pkey)).finally(() => {
      setIsVisible(true);
    });
    dispatch(setSelectFavouritemPkey(pkey));
    getFavouriteList({ skey: undefined, reset: true });
  }, [dispatch, getFavouriteList, navigation, pkey, userToken]);

  const { wrapperStyle } = useMemo(() => styles(theme), [theme]);
  const hitSlop = { top: 10, bottom: 10, left: 10, right: 10 };

  return (
    <View>
      <FavoriteItemModal isVisible={isVisible} setIsVisible={setIsVisible} />
      <View style={wrapperStyle}>
        <Pressable hitSlop={hitSlop} onPress={onFavouritePress}>
          <Animated.View style={outlineStyle}>
            <Icon
              type={IconTypes.MATERIAL_ICONS}
              name={"favorite-border"}
              size={size}
              color={color}
            />
          </Animated.View>

          <Animated.View style={fillStyle}>
            <Icon
              type={IconTypes.MATERIAL_ICONS}
              name={"favorite"}
              size={size}
              color={selectedColor}
            />
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
};

export default memo(Favourite);
