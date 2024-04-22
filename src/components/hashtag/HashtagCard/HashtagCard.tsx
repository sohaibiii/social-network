import React, { memo } from "react";
import { View, TouchableOpacity } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "react-native-paper";

import hashtagCardStyle from "./HashtagCard.styles";
import { HashtagCardProps } from "./HashtagCard.type";

import { CText, Icon, IconTypes } from "~/components/common";
import { AppStackRoutesHashtagProps } from "~/router/AppStackRoutes/AppStackRoutes.type";

const HashtagCard = (props: HashtagCardProps): JSX.Element => {
  const { hashtag = "" } = props;

  const { colors } = useTheme();
  const navigation = useNavigation<AppStackRoutesHashtagProps["navigation"]>();

  const { containerStyle, buttonStyle, iconStyle } = hashtagCardStyle(colors);

  const handleHashtagPressed = () => {
    navigation.navigate("Hashtag", { hashtag });
  };

  return (
    <View style={containerStyle}>
      <View style={iconStyle}>
        <Icon
          type={IconTypes.MATERIAL_ICONS}
          name={"tag"}
          size={20}
          color={colors.white}
        />
      </View>
      <TouchableOpacity onPress={handleHashtagPressed} style={buttonStyle}>
        <CText fontSize={15} lineHeight={20}>{`#${hashtag}`}</CText>
      </TouchableOpacity>
    </View>
  );
};

export default memo(HashtagCard);
