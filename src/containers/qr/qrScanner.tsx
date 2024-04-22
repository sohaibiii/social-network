import React, { useRef, useState } from "react";
import { View } from "react-native";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import queryString from "query-string";
import { BarCodeReadEvent, RNCamera } from "react-native-camera";
import QRCodeScanner from "react-native-qrcode-scanner";
import { Svg, Defs, Rect, Mask } from "react-native-svg";

import { APP_SCREEN_HEIGHT, APP_SCREEN_WIDTH } from "~/constants/";
import { qrScannerStyles } from "~/containers/qr/qrScanner.styles";
import { logEvent, PROFILE_QR_SCANNED_SUCCESS } from "~/services/analytics";
import { resolveDynamicLink } from "~/services/rnFirebase/dynamicLinks";
import { logError } from "~/utils/";

const analyticsSource = "QR_page";

const QRScanner = (): JSX.Element => {
  const qrScannerRef = useRef<QRCodeScanner>(null);
  const navigation = useNavigation();

  const [isNavigatingToProfile, setIsNavigatingToProfile] = useState(false);

  useFocusEffect(() => setIsNavigatingToProfile(false));

  const handleQrRead = (e: BarCodeReadEvent) => {
    const refUrl = e.data;
    if (!refUrl.includes("safarway")) {
      return logError(
        `Error: handleQrRead --qrScanner.tsx-- url=${refUrl} Safarway not found in Url`
      );
    }

    resolveDynamicLink(e.data)
      .then(async ({ url: fullUrl }) => {
        setIsNavigatingToProfile(true);
        const { url: newUrl } = queryString.parseUrl(fullUrl || refUrl);
        const lastIndexOfBackslash = newUrl.lastIndexOf("/");
        const friendUUID = newUrl.substring(lastIndexOfBackslash + 1);

        await logEvent(PROFILE_QR_SCANNED_SUCCESS, {
          source: analyticsSource,
          scanned_user_URI: friendUUID
        });

        navigation.navigate("Profile", {
          uuid: friendUUID,
          hasBackButton: true
        });
      })
      .catch(error => {
        logError(`Error: resolveDynamicLink --qrScanner.tsx-- url=${e.data} ${error}`);
      });
  };
  const {
    customMarkerWrapperStyle,
    customCameraWrapperStyle,
    customMarkerTopLeftCornerStyle,
    customMakerTopRightCornerStyle,
    customMarkerBottomLeftCornerStyle,
    customMarkerBottomRightCornerStyle,
    flexGrow
  } = qrScannerStyles;
  const renderCustomMarker = (
    <View style={customMarkerWrapperStyle}>
      <View style={customCameraWrapperStyle}>
        <View style={customMarkerTopLeftCornerStyle} />
        <View style={customMakerTopRightCornerStyle} />
        <View style={customMarkerBottomLeftCornerStyle} />
        <View style={customMarkerBottomRightCornerStyle} />
      </View>
      <Svg height="100%" width="100%">
        <Defs>
          <Mask id="Mask">
            <Rect x="0" y="0" width="100%" height="100%" fill="white" />
            <Rect rx="20" x="10%" y="20%" width="80%" height="60%" fill="black" />
          </Mask>
        </Defs>
        <Rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="#000"
          fillOpacity="0.4"
          mask="id(#Mask)"
        />
      </Svg>
    </View>
  );

  if (isNavigatingToProfile) {
    return <></>;
  }

  return (
    <View style={flexGrow}>
      <QRCodeScanner
        onRead={handleQrRead}
        ref={qrScannerRef}
        reactivate
        reactivateTimeout={2000}
        flashMode={RNCamera.Constants.FlashMode.auto}
        showMarker
        cameraStyle={{
          width: APP_SCREEN_WIDTH,
          height: APP_SCREEN_HEIGHT - 130
        }}
        customMarker={renderCustomMarker}
      />
    </View>
  );
};

export default QRScanner;
