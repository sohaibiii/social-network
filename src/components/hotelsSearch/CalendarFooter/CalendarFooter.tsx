import React, { FC, useMemo } from "react";
import { View } from "react-native";

import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";
import { useSelector } from "react-redux";

import { CalendarFooterProps } from "./CalendarFooter.types";

import { RootState } from "~/redux/store";

import { Button } from "~/components/";
import calendarFooterStyles from "~/components/hotelsSearch/CalendarFooter/CalendarFooter.style";

const CalendarFooter: FC<CalendarFooterProps> = (props: CalendarFooterProps) => {
  const { onPressCb = () => {} } = props;
  const { colors } = useTheme();
  const { t } = useTranslation();

  const countOfNights = useSelector(
    (state: RootState) => state.hotels.hotelsPayload.countOfNights
  );

  const { buttonContainerStyle, calendarButtonStyle, titleStyle, subtitleStyle } =
    useMemo(() => calendarFooterStyles(colors, !!countOfNights), [colors, countOfNights]);

  const subtitleText = t("hotels.nights_humanized", {
    count: countOfNights,
    context: `_${countOfNights}`
  });

  return (
    <View style={buttonContainerStyle}>
      <Button
        style={calendarButtonStyle}
        onPress={onPressCb}
        labelStyle={titleStyle}
        title={t("done")}
        subtitle={subtitleText}
        subtitleStyle={subtitleStyle}
      />
    </View>
  );
};

export default CalendarFooter;
