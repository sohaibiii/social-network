import React, { useState, useEffect, useMemo, memo } from "react";
import { View } from "react-native";

import { CommonActions, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Button, Paragraph, Dialog, Portal, useTheme } from "react-native-paper";
import { useDispatch } from "react-redux";

import styles from "./HotelExpiry.styles";

import { Icon, IconTypes } from "~/components/common";
import { clearHotelBooking } from "~/redux/reducers/hotels.reducer";

const HotelExpiry = (props: any): JSX.Element => {
  const { visibleFlag } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [isVisible, setIsVisible] = useState(visibleFlag);

  const hideDialog = () => setIsVisible(false);

  const {
    topWrapperStyle,
    dialogStyles,
    sandTimeIconStyle,
    textStyles,
    homeButtonStyle,
    homeButtonLabelStyle,
    dialogActionsWrapperStyle
  } = useMemo(() => styles(colors), [colors]);

  const handleHomePageClicked = () => {
    setIsVisible(false);
    dispatch(clearHotelBooking());

    return navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "HomeTabs" }]
      })
    );
  };

  useEffect(() => {
    setIsVisible(visibleFlag);
  }, [visibleFlag]);

  return (
    <View>
      <Portal>
        <Dialog
          visible={isVisible}
          onDismiss={hideDialog}
          style={dialogStyles}
          dismissable={false}
        >
          <View style={topWrapperStyle}>
            <Icon
              type={IconTypes.SAFARWAY_ICONS}
              name={"hotels_expired"}
              style={sandTimeIconStyle}
            />
          </View>

          <Dialog.Title style={textStyles}>{t("sorry")}!</Dialog.Title>
          <Dialog.Content>
            <Paragraph style={textStyles}>{t("offer_ended")}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions style={dialogActionsWrapperStyle}>
            <Button
              mode="outlined"
              labelStyle={homeButtonLabelStyle}
              onPress={handleHomePageClicked}
              style={homeButtonStyle}
            >
              {t("return_to_homepage")}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default memo(HotelExpiry);
