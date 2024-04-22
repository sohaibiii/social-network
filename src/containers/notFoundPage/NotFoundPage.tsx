import React from "react";
import { SafeAreaView, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";

import styles from "./NotFoundPage.style";

import { Button, CText, Icon, IconTypes } from "~/components/";
import { APP_SCREEN_HEIGHT, APP_SCREEN_WIDTH } from "~/constants/";

const NotFoundPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation();

  const handleNavigateToHome = () => {
    navigation.navigate("Home");
  };

  const { container, primaryTextStyle, buttonContainer, buttonStyle, labelStyle } =
    styles(theme);
  return (
    <SafeAreaView style={container}>
      <Icon
        name="icon_404"
        type={IconTypes.SAFARWAY_ICONS}
        width={APP_SCREEN_WIDTH - 50}
        height={APP_SCREEN_HEIGHT / 4}
      />
      <CText fontSize={20} style={primaryTextStyle}>
        {t("no_results_found")}
      </CText>
      <View style={buttonContainer}>
        <Button
          onPress={handleNavigateToHome}
          labelStyle={labelStyle}
          title={t("main")}
          style={buttonStyle}
        />
      </View>
    </SafeAreaView>
  );
};

export default NotFoundPage;
