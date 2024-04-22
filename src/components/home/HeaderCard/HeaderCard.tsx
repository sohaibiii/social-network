import React, { memo } from "react";
import { View } from "react-native";

import { useTheme, Card } from "react-native-paper";
import { useSelector } from "react-redux";

import styles from "./HeaderCard.styles";
import { HeaderCardType } from "./HeaderCard.types";

import { CText, Icon, IconTypes } from "~/components/common";
import { scale } from "~/utils/responsivityUtil";

const HeaderCard = (props: HeaderCardType): JSX.Element => {
  const {
    name = "destinations",
    icon = "nav_destinations",
    iconType = IconTypes.SAFARWAY_ICONS,
    onPress = () => undefined,
    language = "ar"
  } = props;
  const theme = useTheme();
  const isThemeDark = useSelector((state: RootState) => state.settings.isThemeDark);

  const {
    cardStyles,
    cardBodyStyle,
    textWrapperStyle,
    iconWrapperStyle,
    headerTitleStyle
  } = styles(theme, language);

  const numberOfLines = name.search(" ") === -1 ? 1 : 2;

  return (
    <Card style={cardStyles} onPress={onPress}>
      <View style={cardBodyStyle}>
        <View style={iconWrapperStyle}>
          <Icon
            name={icon}
            type={iconType}
            width={scale(32)}
            height={scale(32)}
            color={theme.colors.homepageItemText}
            size={scale(32)}
            startColor={theme.colors.homepageItemText}
            endColor={isThemeDark ? theme.colors.grayBackground : theme.colors.white}
          />
        </View>
        <View style={textWrapperStyle}>
          <CText
            fontSize={14}
            style={headerTitleStyle}
            adjustsFontSizeToFit
            numberOfLines={numberOfLines}
            color="homepageItemText"
            textAlign="center"
          >
            {name}
          </CText>
        </View>
      </View>
    </Card>
  );
};

export default memo(HeaderCard);
