import React from "react";
import { View } from "react-native";

import { useTranslation } from "react-i18next";
import Config from "react-native-config";
import { useTheme, Button } from "react-native-paper";
import { useSelector } from "react-redux";

import styles from "./ClaimProperty.styles";
import { ClaimPropertyType } from "./ClaimProperty.types";

import { RootState } from "~/redux/store";

import { CText, Icon, IconTypes } from "~/components/common";
import { logEvent, PROPERTY_CLAIM_BUSINESS } from "~/services/";
import { openURL } from "~/services/inappbrowser/inappbrowser";
import { scale } from "~/utils/responsivityUtil";

const ClaimProperty = (props: ClaimPropertyType): JSX.Element => {
  const theme = useTheme();
  const { t } = useTranslation();
  const isThemeDark =
    useSelector((state: RootState) => state.settings.isThemeDark) || false;
  const userToken = useSelector((state: RootState) => state.auth.userToken);
  const language = useSelector((state: RootState) => state.settings.language);

  const { propertyId, slug } = props;

  const handleClaimProperty = async () => {
    await logEvent(PROPERTY_CLAIM_BUSINESS, {
      source: "property_page",
      propertyId,
      slug
    });
    openURL(
      userToken
        ? `${Config.PORTAL_SAFARWAY_URL}/mobile_auth?route=/${language}/business/${propertyId}&id_token=${userToken}`
        : `${Config.PORTAL_SAFARWAY_URL}/mobile_auth?route=/${language}/business/${propertyId}`
    );
  };

  const { buttonLabelStyle, buttonStyle, buttonWrapperStyle, containerStyle } = styles(
    theme,
    isThemeDark
  );

  return (
    <View style={containerStyle}>
      <CText
        fontSize={17}
        color={isThemeDark ? "white" : "primary_blue"}
        fontFamily="thin"
      >
        {t("claim_property_title")}
      </CText>
      <CText fontSize={13} fontFamily="thin">
        {t("claim_property_description")}
      </CText>
      <View style={buttonWrapperStyle}>
        <Button
          mode="outlined"
          onPress={handleClaimProperty}
          style={buttonStyle}
          labelStyle={buttonLabelStyle}
        >
          {t("claim_property_button")}
        </Button>
        <Icon
          type={IconTypes.FONTAWESOME5}
          name="user-shield"
          size={scale(30)}
          color={isThemeDark ? theme.colors.primary_blue : theme.colors.primary}
        />
      </View>
    </View>
  );
};

export default ClaimProperty;
