import React, { FC, useEffect } from "react";
import { ImageBackground, View } from "react-native";

import { useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import pointsBankStyles from "./pointsBank.styles";

import { RootState } from "~/redux/store";

import IMAGES from "~/assets/images";
import { CText } from "~/components/common";
import { myPointsThunk, todayPointsThunk } from "~/redux/thunk";
import { logEvent, BANK_OF_POINTS_HEADER_LOADED } from "~/services/analytics";
import { translate } from "~/translations/swTranslator";

const PointBankHeader: FC = () => {
  const theme = useTheme();

  const {
    imageBackgroundStyle,
    imageContentStyle,
    currentPointsStyle,
    pointsContainerStyle,
    totalPointsStyle
  } = pointsBankStyles(theme);

  const myPoints = useSelector((state: RootState) => state.pointsBank.myPoints);
  const todayPoints = useSelector((state: RootState) => state.pointsBank.todayPoints);
  const isLoadingMyPoints = useSelector(
    (state: RootState) => state.pointsBank.isLoadingMyPoints
  );
  const isLoadingTodayPoints = useSelector(
    (state: RootState) => state.pointsBank.isLoadingTodayPoints
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(myPointsThunk());
    dispatch(todayPointsThunk());
  }, []);

  useEffect(() => {
    if (!isLoadingMyPoints && !isLoadingTodayPoints) {
      logEvent(BANK_OF_POINTS_HEADER_LOADED, {
        source: "points_bank_page",
        today_points: todayPoints,
        total_points: myPoints
      });
    }
  }, [myPoints, todayPoints]);

  return (
    <ImageBackground source={IMAGES.prize_background} style={imageBackgroundStyle}>
      <View style={imageContentStyle}>
        <View style={currentPointsStyle}>
          <CText color="gray" fontSize={14} textAlign="center">
            {translate("current_points").toUpperCase()}
          </CText>
          <View style={pointsContainerStyle}>
            <CText color="white" fontSize={32} textAlign="center">
              {myPoints}
            </CText>
          </View>
        </View>
        <View style={totalPointsStyle}>
          <CText fontSize={12} textAlign="center" color="primary">
            {translate("total_points_last_24")} :
            <CText fontSize={14} fontFamily="medium" color="primary">
              {todayPoints}
            </CText>
          </CText>
        </View>
      </View>
    </ImageBackground>
  );
};

export default PointBankHeader;
