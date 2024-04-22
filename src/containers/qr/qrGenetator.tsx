import React, { useEffect, useState } from "react";
import { ImageURISource, View } from "react-native";

import { useRoute } from "@react-navigation/native";
import { Text, useTheme } from "react-native-paper";
import QRCode from "react-native-qrcode-svg";
import Share from "react-native-share";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { useSelector } from "react-redux";

import { qrStyles } from "./qr.styles";

import { RootState } from "~/redux/store";

import IMAGES from "~/assets/images";
import { Button, ProgressiveImage } from "~/components/";
import { isRTL } from "~/constants/";
import {
  logEvent,
  PROFILE_QR_SHARE_FAILED,
  PROFILE_QR_SHARE_INITIATED,
  PROFILE_QR_SHARE_SUCCESS
} from "~/services/analytics";
import {
  DynamicLinksAction,
  handleCreateShareLink
} from "~/services/rnFirebase/dynamicLinks";
import { translate } from "~/translations/";
import { logError, verticalScale } from "~/utils/";

const analyticsSource = "QR_page";

const QRGenetator = (): JSX.Element => {
  const QR_SIZE = verticalScale(150);

  const { params } = useRoute();
  const { uuid, name, image } = params as {
    uuid: string;
    name: string;
    image: ImageURISource;
  };
  const [referralURL, setReferralURL] = useState("");
  const [isShareLoading, setIsShareLoading] = useState(false);
  const theme = useTheme();
  const { colors } = theme;
  const isThemeDark = useSelector(
    (reduxState: RootState) => reduxState.settings.isThemeDark
  );
  useEffect(() => {
    const message = `${translate(`referral_link_description_text`, { name })}`;

    handleCreateShareLink({
      action: DynamicLinksAction.REFERRAL,
      title: name,
      description: message,
      params: {
        userId: uuid
      }
    })
      .then(link => {
        setReferralURL(link);
      })
      .catch(error => {
        logError(
          `Error: handleCreateShareLink --qrGenerator.tsx-- userId=${uuid} ${error}`
        );
      });
  }, []);

  const handleShareUrl = async () => {
    setIsShareLoading(true);
    await logEvent(PROFILE_QR_SHARE_INITIATED, { source: analyticsSource });
    Share.open({
      title: "Share via",
      message: `${referralURL}`
    })
      .then(() => {
        return logEvent(PROFILE_QR_SHARE_SUCCESS, {
          source: analyticsSource,
          referral_url: referralURL,
          name,
          shared_user_id: uuid
        });
      })
      .catch(error => {
        return logEvent(PROFILE_QR_SHARE_FAILED, { source: analyticsSource });
      })
      .finally(() => {
        setIsShareLoading(false);
      });
  };

  const {
    bottomButtonWrapperStyle,
    bottomSpacerStyle,
    userProfileWrapperStyle,
    mainWrapperStyle,
    topWrapperStyle,
    instructionTextStyle,
    shareButtonStyle,
    usernameStyle,
    userProfileStyle,
    centerText
  } = qrStyles(theme);
  const direction = isRTL ? "left" : "right";

  return (
    <View>
      <View style={topWrapperStyle}>
        <View style={mainWrapperStyle}>
          <View style={userProfileWrapperStyle}>
            <ProgressiveImage
              style={userProfileStyle}
              source={image}
              thumbnailSource={image}
            />
          </View>

          <View style={bottomSpacerStyle}>
            <Text style={usernameStyle}>{name}</Text>
            <Text style={centerText}>{translate("please_scan_qr_code")}</Text>
          </View>

          {referralURL ? (
            <QRCode
              backgroundColor={colors.surface}
              color={colors.text}
              value={referralURL}
              logoSize={30}
              logoBackgroundColor={colors.surface}
              logo={isThemeDark ? IMAGES.logo_white : IMAGES.logo}
              size={QR_SIZE}
            />
          ) : (
            <SkeletonPlaceholder
              direction={direction}
              highlightColor={colors.skeleton.highlight}
              backgroundColor={colors.skeleton.background}
            >
              <View style={{ height: QR_SIZE, width: QR_SIZE }} />
            </SkeletonPlaceholder>
          )}
        </View>
        <Text style={instructionTextStyle}>{translate("qrDescription")}</Text>
      </View>
      <View style={bottomButtonWrapperStyle}>
        <Button
          style={shareButtonStyle}
          title={translate("share")}
          onPress={handleShareUrl}
          isLoading={isShareLoading}
        />
      </View>
    </View>
  );
};

export default QRGenetator;
