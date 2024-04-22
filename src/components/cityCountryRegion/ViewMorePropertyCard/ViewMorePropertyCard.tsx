import React, { memo, useCallback, useMemo } from "react";
import { TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import isEqual from "react-fast-compare";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";

import styles from "./ViewMorePropertyCard.style";

import { CText, Icon, IconTypes } from "~/components/";
import { scale } from "~/utils/";
const cardWidth = 150;

const ViewMorePropertyCard = ({
  pkey,
  propertiesTitle,
  total,
  destinationPkey,
  title,
  type
}): JSX.Element => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { containerStyle, iconStyle, iconWrapperStyle } = useMemo(
    () => styles(theme, cardWidth),
    [theme]
  );

  const handleMorePropertyCallback = useCallback(() => {
    navigation.navigate("CityCountryRegionRelatedProperties", {
      type,
      destinationPkey,
      pkey,
      total,
      title,
      propertiesTitle
    });
  }, [destinationPkey, navigation, pkey, propertiesTitle, title, total, type]);

  return (
    <TouchableOpacity onPress={handleMorePropertyCallback} style={containerStyle}>
      <View style={iconWrapperStyle}>
        <Icon
          type={IconTypes.MATERIAL_COMMUNITY_ICONS}
          color={theme.colors.primary}
          size={scale(44)}
          name={"plus-circle"}
          style={iconStyle}
        />
      </View>
      <CText fontSize={16}>{t("more")}</CText>
    </TouchableOpacity>
  );
};

export default memo(ViewMorePropertyCard, isEqual);
