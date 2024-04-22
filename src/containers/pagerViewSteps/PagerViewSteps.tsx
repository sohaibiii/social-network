import React, { useRef, useState, useEffect, useCallback } from "react";
import { Keyboard, TouchableOpacity, View, BackHandler, StatusBar } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Modal from "react-native-modal";
import { useTheme } from "react-native-paper";
import { useSelector } from "react-redux";

import pagerViewStepsStyle from "./PagerViewSteps.style";
import { PagerViewStepsProps } from "./PagerViewSteps.types";

import { RootState } from "~/redux/store";

import { CText, Icon, IconTypes, modalizeRef } from "~/components/";
import { ParallaxScrollView } from "~/components/common";
import { ParallaxScrollViewRef } from "~/components/common/ParallaxScrollView/ParallaxScrollView.types";
import { Footer, ExitDialogContent } from "~/components/pagerViewSteps";
import { scale, verticalScale } from "~/utils/";

const PagerViewSteps = (props: PagerViewStepsProps): JSX.Element => {
  const { t } = useTranslation();
  const {
    title = "" as string | string[],
    pages = [],
    getStepCount = (_page: number) => 1,
    containerStyle = {},
    headerExpandedHeight = verticalScale(150) as number | number[],
    gradientStart = { x: 0, y: 0.7 },
    gradientEnd = { x: 1, y: -0.6 },
    nextButtonDisabled = false,
    stepSize = 1,
    lastButtonLabel = t("finish"),
    onFinishPressed = () => undefined,
    onPreviousPressed = () => undefined,
    onNextPressed = () => undefined,
    onExitCb = () => undefined,
    clearDataCb = () => undefined,
    pageCallback = () => undefined,
    ...restOfProps
  } = props;
  const Content = useSelector((reduxState: RootState) => reduxState.bottomSheet.Content);
  const isEditPost = useSelector(
    (reduxState: RootState) => reduxState.propertySocialAction.addPost.isEditPost
  );

  const parallaxScrollViewRef = useRef<ParallaxScrollViewRef>(null);
  const navigation = useNavigation();
  const { colors } = useTheme();
  const unexpandedHeader = <View />;
  const footerHeight = verticalScale(40);
  const numberOfPages = pages.length;
  const [currentPage, setCurrentPage] = useState(0);
  const [isCloseDialogVisible, setIsCloseDialogVisible] = useState(false);
  const [shouldGoBack, setShouldGoBack] = useState(false);
  const keyboardVisible = useRef<boolean>(false);

  const { closeButtonContainerStyle, flex, pagerViewTitleStyle } =
    pagerViewStepsStyle(colors);

  const getHeaderExpandedHeight = useCallback(() => {
    if (typeof headerExpandedHeight === "number") {
      return headerExpandedHeight;
    } else {
      return headerExpandedHeight[currentPage];
    }
  }, [currentPage, headerExpandedHeight]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      if (keyboardVisible.current) {
        return;
      }
      keyboardVisible.current = true;
      parallaxScrollViewRef?.current?.scrollTo(
        0,
        getHeaderExpandedHeight() - 10 - StatusBar?.currentHeight
      );
    });
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      keyboardVisible.current = false;
      parallaxScrollViewRef?.current?.scrollTo(0, 0);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [getHeaderExpandedHeight]);

  // callback when page changes
  useEffect(() => {
    pageCallback(currentPage);
  }, [currentPage, pageCallback]);

  const getHeaderTitle = () => {
    if (typeof title === "string") {
      return title;
    } else {
      return title[currentPage];
    }
  };

  const showCloseDialog = () => {
    setIsCloseDialogVisible(true);
  };

  const hideSheet = () => {
    setIsCloseDialogVisible(false);
  };

  const expandedHeader = (
    <TouchableOpacity onPress={showCloseDialog} style={closeButtonContainerStyle}>
      <Icon
        type={IconTypes.ANT_DESIGN}
        name={"close"}
        size={scale(14)}
        color={colors.white}
      />
    </TouchableOpacity>
  );

  const content = <View style={containerStyle}>{pages[currentPage]}</View>;

  const handleNextPressed = () => {
    const stepCount = getStepCount(currentPage);
    onNextPressed(currentPage, stepCount >= 2);
    setCurrentPage(page => page + stepCount);
  };
  const handlePreviousPressed = () => {
    const stepCount = getStepCount(currentPage - stepSize);
    onPreviousPressed(currentPage, stepCount >= 2);
    setCurrentPage(page => page - stepCount);
  };
  const handleFinishPressed = () => {
    onFinishPressed();
  };

  const handleParallaxScrollViewHeader = () => (
    <CText fontSize={18} style={pagerViewTitleStyle}>
      {getHeaderTitle()}
    </CText>
  );

  const handleOnExitDialogPressed = (shouldSaveWork: boolean) => {
    setShouldGoBack(true);
    if (!shouldSaveWork || isEditPost) {
      clearDataCb();
    }
    onExitCb(shouldSaveWork);
    hideSheet();
  };

  useEffect(() => {
    const handler = () => {
      if (Content) {
        modalizeRef.current?.close();
        return true;
      }
      if (currentPage > 0) {
        handlePreviousPressed();
        return true;
      }
      showCloseDialog();
      return true;
    };
    BackHandler.addEventListener("hardwareBackPress", handler);
    return () => BackHandler.removeEventListener("hardwareBackPress", handler);
  }, [Content, currentPage, handlePreviousPressed]);

  useEffect(() => {
    parallaxScrollViewRef?.current?.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <View style={flex}>
      <ParallaxScrollView
        ref={parallaxScrollViewRef}
        hasBackButton={false}
        headerComponent={handleParallaxScrollViewHeader}
        unexpandedHeader={unexpandedHeader}
        expandedHeader={expandedHeader}
        content={content}
        bounces={false}
        headerCollapsedHeight={0}
        contentWithInset={true}
        gradientStart={gradientStart}
        gradientEnd={gradientEnd}
        headerExpandedHeight={getHeaderExpandedHeight()}
        showsVerticalScrollIndicator={false}
        {...restOfProps}
      />
      <Footer
        lastButtonLabel={lastButtonLabel}
        height={footerHeight}
        numberOfPages={numberOfPages}
        currentPage={currentPage}
        isNextDisabled={nextButtonDisabled}
        onPreviousPressed={handlePreviousPressed}
        onNextPressed={handleNextPressed}
        onFinishPressed={handleFinishPressed}
      />
      <Modal
        onBackButtonPress={hideSheet}
        isVisible={isCloseDialogVisible}
        animationIn={"slideInUp"}
        animationOut={"slideOutDown"}
        backdropOpacity={0.5}
        backdropTransitionOutTiming={0}
        onModalHide={shouldGoBack ? navigation.goBack : undefined}
        onBackdropPress={hideSheet}
        onSwipeComplete={hideSheet}
        onDismiss={hideSheet}
      >
        <ExitDialogContent
          onCancelCb={hideSheet}
          onExitCb={handleOnExitDialogPressed}
          withSaveWork={!isEditPost}
        />
      </Modal>
    </View>
  );
};

export default PagerViewSteps;
