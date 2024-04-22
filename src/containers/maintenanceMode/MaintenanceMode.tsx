import React from "react";
import { SafeAreaView } from "react-native";

import { useTranslation } from "react-i18next";
import { Text, useTheme } from "react-native-paper";

import styles from "./MaintenanceMode.style";

import { Icon, IconTypes } from "~/components/";
import { APP_SCREEN_HEIGHT, APP_SCREEN_WIDTH } from "~/constants/";

const MaintenanceMode = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const { container, secondaryTextStyle, primaryTextStyle } = styles(theme);
  return (
    <SafeAreaView style={container}>
      <Icon
        name="maintenance_mode"
        type={IconTypes.SAFARWAY_ICONS}
        width={APP_SCREEN_WIDTH - 50}
        height={APP_SCREEN_HEIGHT / 2}
        style={{}}
      />
      <Text style={primaryTextStyle}>{t("maintenance_title")}</Text>
      <Text style={secondaryTextStyle}>{t("maintenance_description_1")}</Text>
      <Text style={secondaryTextStyle}>{t("maintenance_description_2")}</Text>
    </SafeAreaView>
  );
};

export default MaintenanceMode;
