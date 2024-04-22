import React from "react";
import { View, TouchableOpacity, Linking } from "react-native";

import { useTranslation } from "react-i18next";
import { Divider, useTheme } from "react-native-paper";

import styles from "./ContactBusiness.styles";
import { ContactBusinessTypes } from "./ContactBusiness.types";

import { CText, Icon, IconTypes } from "~/components/common";
import {
  logEvent,
  CONTACT_BUSINESS_SEND_EMAIL,
  CONTACT_BUSINESS_OPEN_URL,
  CONTACT_BUSINESS_CALL_PHONE
} from "~/services/";
import { openURL } from "~/services/inappbrowser/inappbrowser";
import { scale } from "~/utils/responsivityUtil";

const ContactBusiness = (props: ContactBusinessTypes): JSX.Element => {
  const { phone, website, email } = props;
  const { t } = useTranslation();
  const theme = useTheme();

  const handleSendEmail = async () => {
    await logEvent(CONTACT_BUSINESS_SEND_EMAIL, {
      source: "property_page",
      email
    });

    Linking.openURL(`mailto:${email}`);
  };

  const handleVisitWebsite = async () => {
    await logEvent(CONTACT_BUSINESS_OPEN_URL, {
      source: "property_page",
      website
    });
    !!website && openURL(website);
  };

  const handleCallPhone = async () => {
    await logEvent(CONTACT_BUSINESS_CALL_PHONE, {
      source: "property_page",
      phone
    });

    Linking.openURL(`tel:${phone}`);
  };

  const {
    contentContainerStyle,
    rightWrapperStyle,
    iconWrapperStyle,
    rowWrapperStyle,
    titleWrapper,
    dividerStyle,
    callTextStyle
  } = styles(theme);

  return (
    <View>
      <View style={contentContainerStyle}>
        <View style={rightWrapperStyle}>
          {!!email && (
            <>
              <TouchableOpacity style={rowWrapperStyle} onPress={handleSendEmail}>
                <View style={titleWrapper}>
                  <CText fontSize={13}>{t("send_email")}</CText>
                </View>

                <View style={iconWrapperStyle}>
                  <Icon
                    type={IconTypes.FONTISTO}
                    name="email"
                    color={theme.colors.text}
                    disabled
                    size={scale(20)}
                  />
                </View>
              </TouchableOpacity>
              <Divider style={dividerStyle} />
            </>
          )}
          {!!website && (
            <>
              <TouchableOpacity style={rowWrapperStyle} onPress={handleVisitWebsite}>
                <View style={titleWrapper}>
                  <CText fontSize={13}>{`${t("website")}`}</CText>
                </View>

                <View style={iconWrapperStyle}>
                  <Icon
                    type={IconTypes.SAFARWAY_ICONS}
                    name="globe"
                    color={theme.colors.text}
                    disabled
                    width={scale(20)}
                    height={scale(20)}
                  />
                </View>
              </TouchableOpacity>
              <Divider style={dividerStyle} />
            </>
          )}
          {!!phone && (
            <>
              <TouchableOpacity style={rowWrapperStyle} onPress={handleCallPhone}>
                <View style={titleWrapper}>
                  <CText fontSize={13} style={callTextStyle}>{`${t("call")}`}</CText>
                  <CText fontSize={12} color="gray" fontFamily={"light"} lineHeight={30}>
                    {`${phone}`}
                  </CText>
                </View>

                <View style={iconWrapperStyle}>
                  <Icon
                    type={IconTypes.SAFARWAY_ICONS}
                    name="phone"
                    color={theme.colors.text}
                    disabled
                    width={scale(20)}
                    height={scale(20)}
                  />
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default ContactBusiness;
