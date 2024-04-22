import React from "react";
import { View, TouchableOpacity } from "react-native";

import moment from "moment";
import momentTz from "moment-timezone";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";

import styles from "./WorkingHours.styles";
import { WorkingHoursProps } from "./WorkingHours.types";

import { RootState } from "~/redux/store";

import { CText, Icon, IconTypes } from "~/components/common";
import { APP_SCREEN_HEIGHT, isRTL } from "~/constants/variables";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import { verticalScale } from "~/utils/";

const WorkingHours = (props: WorkingHoursProps): JSX.Element => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const language = useSelector((state: RootState) => state.settings.language) || "ar";

  const { workingHours = {}, isOpen } = props;
  const todayNumber = moment().isoWeekday(); // returns 1-7 where 1 is Monday and 7 is Sunday

  const weekArray = moment
    .localeData("en")
    .weekdays()
    .map(weekday => weekday.toLowerCase());

  const weekArrayLocalized = moment
    .localeData(language)
    .weekdays()
    .map(weekday => weekday.toLowerCase());

  const todayDay = weekArray[todayNumber - 1];
  const timezone =
    !Array.isArray(workingHours[todayDay]) || workingHours[todayDay][0]?.timezone === ""
      ? "Asia/Jerusalem"
      : workingHours[todayDay][0].timezone;
  const currentDay = moment(momentTz().tz(timezone).toDate())
    .locale("en")
    .format("dddd")
    .toLowerCase();

  const today = (workingHours[currentDay] && workingHours[currentDay][0]) || {};
  const { to, from } = today || {};

  const {
    hourDetailsRowWrapper,
    weekdayRowWrapper,
    hoursRowWrapper,
    cardWrapperStyle,
    hoursSummaryWrapperStyle,
    arrowIconStyle,
    covidHoursParagraph,
    titleTextStyle,
    daysStyle
  } = styles;

  const containerStyle = { marginBottom: insets.bottom + verticalScale(20) };

  const renderWorkingHoursContent = () => {
    return (
      <View style={containerStyle}>
        <CText textAlign="center" style={titleTextStyle}>
          {t("working_hours")}
        </CText>
        {weekArray?.map((item, index) => {
          if (!workingHours[item]) {
            return (
              <View key={item} style={hourDetailsRowWrapper}>
                <View style={weekdayRowWrapper}>
                  <CText textAlign="left" fontSize={14}>
                    {weekArrayLocalized[index]}
                  </CText>
                </View>
                <View style={hoursRowWrapper}>
                  <CText fontSize={15} color={"red"}>
                    {t("closed")}
                  </CText>
                </View>
              </View>
            );
          }
          const { from, to } = workingHours[item][0];
          return (
            <View key={item} style={hourDetailsRowWrapper}>
              <View style={weekdayRowWrapper}>
                <CText style={daysStyle} textAlign="left" fontSize={14}>
                  {weekArrayLocalized[index]}
                </CText>
              </View>
              <View style={hoursRowWrapper}>
                <CText textAlign="left" fontSize={14}>{`${moment(from, "HH:mm:ss")
                  .locale("en")
                  .format("hh:mm")} ${moment(from, "HH:mm:ss")
                  .locale(language)
                  .format("A")}   -   ${moment(to, "HH:mm:ss")
                  .locale("en")
                  .format("hh:mm")} ${moment(to, "HH:mm:ss")
                  .locale(language)
                  .format("A")}`}</CText>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const handleShowWorkingHours = () => {
    dispatch(
      showBottomSheet({
        Content: renderWorkingHoursContent,
        props: {
          modalHeight: APP_SCREEN_HEIGHT / 2
        },
        customProps: {
          flatListProps: null
        }
      })
    );
  };

  return (
    <View style={cardWrapperStyle}>
      <TouchableOpacity style={hoursSummaryWrapperStyle} onPress={handleShowWorkingHours}>
        <CText lineHeight={18} fontSize={13} color={isOpen ? "primary_blue_d" : "red"}>
          {isOpen ? t("open_now") : t("closed_now")}
        </CText>
        {isOpen && (
          <CText fontSize={13} lineHeight={18} fontFamily={"light"}>{`${moment(
            from,
            "HH:mm:ss"
          )
            .locale("en")
            .format("hh:mm")} ${moment(from, "HH:mm:ss")
            .locale(language)
            .format("A")} - ${moment(to, "HH:mm:ss")
            .locale("en")
            .format("hh:mm")} ${moment(to, "HH:mm:ss")
            .locale(language)
            .format("A")}`}</CText>
        )}
        <Icon
          name={isRTL ? "chevron-left" : "chevron-right"}
          type={IconTypes.ENTYPO}
          color={colors.text}
          size={30}
          style={arrowIconStyle}
        />
      </TouchableOpacity>
      <CText
        lineHeight={17}
        fontFamily={"light"}
        color="gray"
        fontSize={12}
        style={covidHoursParagraph}
      >
        {t("working_hours_covid")}
      </CText>
    </View>
  );
};

export default WorkingHours;
