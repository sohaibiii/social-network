import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { FlatList, Keyboard, StatusBar, TouchableOpacity, View } from "react-native";

import Modal from "react-native-modal";
import { Portal, useTheme } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";

import { FavoriteItemModalProps } from "./favoriteItemModal.types";

import { RootState } from "~/redux/store";

import { CircularLoader, Icon, IconTypes } from "~/components/common";
import bottomSheetStyle from "~/components/common/BottomSheet/BottomSheet.style";
import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import {
  FavouriteListRow,
  MoveToAnotherListFooter,
  MoveToAnotherListHeader
} from "~/components/favoriteList/favouriteListRow";
import carouselMapItemStyle from "~/components/surroundingLandmarks/carouselMapItem/carouselMapItem.styles";
import { FOOTER_LOADER, REFRESH_LOADER } from "~/constants/toggleState";
import { APP_SCREEN_HEIGHT, PLATFORM } from "~/constants/variables";
import { getFavouriteListProps } from "~/containers/favoriteList/favouriteList.types";
import { clearFavouriteListData } from "~/redux/reducers/favorite.slice";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import { getFavouriteListThunk } from "~/redux/thunk/favorite.thunk";
import {
  logEvent,
  FAVORITE_ITEMS_MODAL_GET_FAVORITES,
  FAVORITE_ITEMS_MODAL_GET_FAVORITES_SUCCESS,
  FAVORITE_ITEMS_MODAL_GET_FAVORITES_FAILED
} from "~/services/";
import { translate } from "~/translations/swTranslator";
import { logError, moderateScale } from "~/utils/";
import { useToggleState } from "~/utils/hooks";
import { thunkDispatch } from "~/utils/reduxUtil";

const FavoriteItemModal: FC<FavoriteItemModalProps> = props => {
  const { isMoveToAnother, bottomSheetRef, setIsVisible, isVisible } = props || {};

  const [getToggleState, setToggleState] = useToggleState([
    REFRESH_LOADER,
    FOOTER_LOADER
  ]);
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { loaderStyle, contentContainerStyle, modalStyle } = carouselMapItemStyle;
  const [isInnerVisible, setIsInnerVisible] = useState(isVisible);
  const { isEndReached, skey } =
    useSelector((state: RootState) => state.favorite.favouriteListPageDetails) || {};
  const favouriteList =
    useSelector((state: RootState) => state.favorite.favouriteList) || [];

  const offset = useSharedValue(0);

  useEffect(() => {
    setIsInnerVisible(isVisible);
  }, [isVisible]);

  useEffect(() => {
    const showKeyboardSubscription = Keyboard.addListener("keyboardDidShow", e => {
      if (PLATFORM === "ios")
        offset.value = withSpring(e.endCoordinates.height, {
          velocity: 1000,
          damping: 15,
          stiffness: 150,
          restSpeedThreshold: 10
        });
    });
    const hideKeyboardSubscription = Keyboard.addListener("keyboardDidHide", () => {
      if (PLATFORM === "ios")
        offset.value = withSpring(0, {
          velocity: 1000,
          damping: 15,
          stiffness: 150,
          restSpeedThreshold: 10
        });
    });

    return () => {
      showKeyboardSubscription.remove();
      hideKeyboardSubscription.remove();
    };
  }, []);
  const favouriteItemsLoading = useSelector(
    (state: RootState) => state.favorite.favouriteItemsLoading
  );

  const preSelectedFavouriteItems = useSelector(
    (state: RootState) => state.favorite.preSelectedFavouriteItems
  );
  const selectFavouritePkey = useSelector(
    (state: RootState) => state.favorite.selectFavouritePkey
  );

  const getFavouriteList = async ({ loader, reset, skey }: getFavouriteListProps) => {
    setToggleState(loader, true);
    await logEvent(FAVORITE_ITEMS_MODAL_GET_FAVORITES, {
      source: "favorite_items_modal",
      last_loaded_skey: skey,
      reset
    });

    thunkDispatch(getFavouriteListThunk({ reset, skey }))
      .then(async () => {
        await logEvent(FAVORITE_ITEMS_MODAL_GET_FAVORITES_SUCCESS, {
          source: "favorite_items_modal",
          last_loaded_skey: skey,
          reset
        });
      })
      .catch(async error => {
        await logEvent(FAVORITE_ITEMS_MODAL_GET_FAVORITES_FAILED, {
          source: "favorite_items_modal",
          last_loaded_skey: skey,
          reset
        });
        logError(
          `Error in FavoriteItemModal.tsx reset=${reset} with skey ${skey} ${error}`
        );
        dispatch(
          showSnackbar({
            text: translate("something_went_wrong"),
            type: SnackbarVariations.TOAST,
            duration: 2000,
            backgroundColor: "red"
          })
        );
      })
      .finally(() => {
        setToggleState(loader);
      });
  };

  const ListEmptyComponent = useCallback(() => {
    if (!getToggleState(FOOTER_LOADER)) return null;
    return (
      <View style={loaderStyle}>
        <CircularLoader />
      </View>
    );
  }, [getToggleState(FOOTER_LOADER)]);

  const renderItem = useCallback(({ item }) => <FavouriteListRow item={item} />, []);

  const onEndReached = useCallback(() => {
    if (!isEndReached && !getToggleState(FOOTER_LOADER)) {
      getFavouriteList({ loader: FOOTER_LOADER, skey });
    }
  }, [getToggleState(FOOTER_LOADER), isEndReached, skey]);

  const onRefresh = useCallback(() => {
    getFavouriteList({ loader: REFRESH_LOADER, reset: true });
  }, []);

  const ListFooterComponent = useCallback(() => {
    if (!getToggleState(FOOTER_LOADER)) return null;
    return (
      <View style={loaderStyle}>
        <CircularLoader />
      </View>
    );
  }, [getToggleState(FOOTER_LOADER)]);

  const FooterComponent = useCallback(
    () => <MoveToAnotherListFooter setIsVisible={setIsVisible} />,
    [selectFavouritePkey]
  );

  const HeaderComponent = useCallback(() => <MoveToAnotherListHeader />, []);

  const keyExtractor = useCallback(item => item.skey, []);

  const data = favouriteList.filter(item =>
    isMoveToAnother ? !preSelectedFavouriteItems?.includes(item?.skey) : favouriteList
  );

  const handleModalClose = () => {
    setIsVisible(false);
  };

  const { handleStyle, containerStyle } = bottomSheetStyle;

  const animatedStyles = useAnimatedStyle(() => {
    return {
      paddingBottom: offset.value
    };
  });

  const bottomSheetStyles = [
    { backgroundColor: colors.background },
    containerStyle,
    { marginTop: APP_SCREEN_HEIGHT * 0.15 + StatusBar?.currentHeight },
    animatedStyles
  ];

  const handleOnModalHide = () => {
    dispatch(clearFavouriteListData());
    setIsInnerVisible(false);
  };
  if (!isInnerVisible) {
    return <></>;
  }

  return (
    <Portal>
      <Modal
        animationIn={"slideInUp"}
        animationOut={"slideOutDown"}
        backdropOpacity={0.5}
        backdropTransitionOutTiming={0}
        coverScreen={false}
        avoidKeyboard={true}
        propagateSwipe
        style={modalStyle}
        isVisible={isVisible}
        swipeDirection={"down"}
        onModalWillHide={handleModalClose}
        onBackdropPress={handleModalClose}
        onSwipeComplete={handleModalClose}
        onDismiss={handleModalClose}
        onModalHide={handleOnModalHide}
        ref={bottomSheetRef}
        handleComponent={() => <HeaderComponent />}
        footerComponent={() => <FooterComponent />}
        onBackButtonPress={handleModalClose}
      >
        <Animated.View style={bottomSheetStyles}>
          <TouchableOpacity onPress={handleModalClose} style={handleStyle}>
            <Icon
              disabled
              color={colors.text}
              name="drag-handle"
              type={IconTypes.MATERIAL_ICONS}
              size={moderateScale(30)}
            />
          </TouchableOpacity>
          <HeaderComponent />
          <FlatList
            data={data}
            keyboardShouldPersistTaps={"handled"}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            onEndReached={onEndReached}
            ListEmptyComponent={ListEmptyComponent}
            onRefresh={onRefresh}
            refreshing={!!getToggleState(REFRESH_LOADER)}
            contentContainerStyle={contentContainerStyle}
            ListFooterComponent={ListFooterComponent}
          />
          <FooterComponent />
        </Animated.View>
      </Modal>
    </Portal>
  );
};

export default memo(FavoriteItemModal);
