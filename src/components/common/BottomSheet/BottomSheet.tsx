import React, { createRef, FC, useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  ScrollView,
  TouchableHighlight,
  View,
  TouchableOpacity
} from "react-native";

import Modal from "react-native-modal";
import { useTheme } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "~/redux/store";

import { Icon, IconTypes } from "~/components/";
import bottomSheetStyle from "~/components/common/BottomSheet/BottomSheet.style";
import { PLATFORM } from "~/constants/variables";
import { clearBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import { IBottomSheet } from "~/redux/types/bottomSheet.types";
import { moderateScale } from "~/utils/";

export const modalizeRef = createRef<Modal>();
export const bottomSheetScrollViewRef = createRef<ScrollView>();

const BottomSheetComponent: FC<IBottomSheet["props"]> = bottomSheetProps => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const Content = useSelector((reduxState: RootState) => reduxState.bottomSheet.Content);
  const customProps = useSelector(
    (reduxState: RootState) => reduxState.bottomSheet.customProps
  );
  const props = useSelector((reduxState: RootState) => reduxState.bottomSheet.props);

  const {
    modalBackgroundColor = colors.background,
    flatListProps,
    FooterComponent,
    HeaderComponent,
    children,
    scrollViewProps,
    withoutHeaderMargin,
    fullScreen = false,
    onClose = () => {},
    onDismissCb = () => {},
    disableKeyboardOffset = false,
    withHandle = true,
    style = {},
    bottomSheetStyle: bottomSheetStyleProp = {},
    hasScrollableView = false,
    ...rest
  } = props || bottomSheetProps || {};

  const [isVisible, setisVisible] = useState(!!Content || flatListProps);

  const {
    footerStyle,
    containerStyle,
    modalStyle,
    handleStyle,
    fullScreenContainerStyle
  } = bottomSheetStyle;

  const modalStyles = [modalStyle, style];
  const insets = useSafeAreaInsets();
  const _flatListProps = customProps?.flatListProps || flatListProps;
  const _scrollViewProps = customProps?.scrollViewProps || scrollViewProps;
  const _FooterComponent = customProps?.FooterComponent || FooterComponent;
  const _HeaderComponent = customProps?.HeaderComponent || HeaderComponent;
  const offset = useSharedValue(0);
  const headerWithMargin = useCallback(
    () =>
      withoutHeaderMargin ? (
        <></>
      ) : (
        <View>{_HeaderComponent ? <_HeaderComponent /> : <View />}</View>
      ),
    [_HeaderComponent, withoutHeaderMargin]
  );

  const hideModal = () => {
    Keyboard.dismiss();
    setisVisible(false);
    onClose();
  };

  useEffect(() => {
    const showKeyboardSubscription = Keyboard.addListener("keyboardDidShow", e => {
      if (PLATFORM === "ios" && !disableKeyboardOffset) {
        offset.value = withSpring(e.endCoordinates.height, {
          velocity: 1000,
          damping: 15,
          stiffness: 150,
          restSpeedThreshold: 10
        });
      }
    });
    const hideKeyboardSubscription = Keyboard.addListener("keyboardDidHide", () => {
      if (PLATFORM === "ios" && !disableKeyboardOffset) {
        offset.value = withSpring(0, {
          velocity: 1000,
          damping: 15,
          stiffness: 150,
          restSpeedThreshold: 10
        });
      }
    });

    return () => {
      showKeyboardSubscription.remove();
      hideKeyboardSubscription.remove();
    };
  }, [disableKeyboardOffset, offset]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      paddingBottom: offset.value
    };
  });

  const bottomSheetStyles = [
    { backgroundColor: modalBackgroundColor },
    fullScreen ? fullScreenContainerStyle : containerStyle,
    bottomSheetStyleProp,
    animatedStyles
  ];
  const footerStyles = [{ paddingBottom: insets.bottom }, footerStyle];

  useEffect(() => {
    setisVisible(!!(Content || flatListProps));
  }, [Content, flatListProps]);

  const handleOnModalHide = () => {
    dispatch(clearBottomSheet({}));
  };
  const handleDismiss = () => {
    hideModal();
    onDismissCb();
  };
  return (
    <Modal
      ref={modalizeRef}
      onBackButtonPress={handleDismiss}
      isVisible={isVisible}
      animationIn={"slideInUp"}
      animationOut={"slideOutDown"}
      backdropOpacity={0.5}
      backdropTransitionOutTiming={0}
      onModalWillHide={hideModal}
      onBackdropPress={handleDismiss}
      onSwipeComplete={hideModal}
      onDismiss={handleDismiss}
      onModalHide={handleOnModalHide}
      coverScreen={false}
      swipeDirection={"down"}
      propagateSwipe={true}
      avoidKeyboard={true}
      hasScrollableView={hasScrollableView}
      style={modalStyles}
      {...rest}
    >
      <Animated.View style={bottomSheetStyles}>
        {!!withHandle && (
          <TouchableOpacity onPress={handleDismiss} style={handleStyle}>
            <Icon
              disabled
              color={colors.text}
              name="drag-handle"
              type={IconTypes.MATERIAL_ICONS}
              size={moderateScale(30)}
            />
          </TouchableOpacity>
        )}

        {!!headerWithMargin && headerWithMargin()}
        {!!_scrollViewProps && (
          <ScrollView ref={bottomSheetScrollViewRef} {..._scrollViewProps}>
            <TouchableHighlight>
              <Content />
            </TouchableHighlight>
          </ScrollView>
        )}
        {_flatListProps && <FlatList {..._flatListProps} />}
        {Content && !_flatListProps && !_scrollViewProps ? (
          <Content />
        ) : children ? (
          children
        ) : null}
        {!!_FooterComponent && (
          <View style={footerStyles}>
            <_FooterComponent />
          </View>
        )}
      </Animated.View>
    </Modal>
  );
};

export default BottomSheetComponent;
