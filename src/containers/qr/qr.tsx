import React, { useState } from "react";

import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useTheme, Appbar } from "react-native-paper";
import {
  TabView,
  SceneMap,
  TabBar,
  NavigationState,
  SceneRendererProps
} from "react-native-tab-view";

import QRGenerator from "./qrGenetator";
import QRScanner from "./qrScanner";

import { APP_SCREEN_WIDTH } from "~/constants/";
import { qrStyles } from "~/containers/qr/qr.styles";
import {
  logEvent,
  PROFILE_QR_CODE_TAB_PRESSED,
  PROFILE_QR_SCANNER_TAB_PRESSED
} from "~/services/analytics";

const analyticsSource = "QR_page";

const renderScene = SceneMap({
  reader: QRGenerator,
  scanner: QRScanner
});

const QR = (): JSX.Element => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [tabIndex, setTabIndex] = useState(0);
  const [routes] = React.useState([
    { key: "reader", title: t("qr_code"), eventName: PROFILE_QR_CODE_TAB_PRESSED },
    { key: "scanner", title: t("qr_scanner"), eventName: PROFILE_QR_SCANNER_TAB_PRESSED }
  ]);

  const {
    tabBarLabelStyle,
    tabBarIndicatorStyle,
    tabBarStyle,
    appBarHeader,
    appBarContentStyle
  } = qrStyles(theme);

  const renderTabBar = (
    props: SceneRendererProps & {
      navigationState: NavigationState<{ key: string; title: string }>;
    }
  ) => (
    <TabBar
      {...props}
      labelStyle={tabBarLabelStyle}
      indicatorStyle={tabBarIndicatorStyle}
      style={tabBarStyle}
    />
  );

  const navigation = useNavigation();

  const onIndexChangeCb = async (index: number) => {
    await logEvent(routes[index]?.eventName, { source: analyticsSource });
    setTabIndex(index);
  };

  return (
    <>
      <Appbar.Header style={appBarHeader}>
        <Appbar.BackAction color={theme.colors.text} onPress={navigation.goBack} />
        <Appbar.Content titleStyle={appBarContentStyle} title="QR Code" />
      </Appbar.Header>
      <TabView
        navigationState={{ index: tabIndex, routes }}
        renderScene={renderScene}
        onIndexChange={onIndexChangeCb}
        initialLayout={{ width: APP_SCREEN_WIDTH }}
        renderTabBar={renderTabBar}
      />
    </>
  );
};

export default QR;
