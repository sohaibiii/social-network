import React from "react";
import { TouchableOpacity, View } from "react-native";

import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

import styles from "./InAppWebPageViewer.styles";

import { CText, Icon, IconTypes } from "~/components/";
import { isRTL, PLATFORM } from "~/constants/";
import { AppStackRoutesArticleDetailsProps } from "~/router/Router/AppStackRoutes/AppStackRoutes.type";
import { moderateScale } from "~/utils/";

const InAppWebPageViewer = (props: AppStackRoutesArticleDetailsProps): JSX.Element => {
  const { route, navigation } = props;
  const { link, title = "" } = route?.params;
  const source = { uri: link };
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const {
    headerContainerStyle,
    androidContainer,
    iOSContainer,
    backButtonStyle,
    titleStyle
  } = styles(colors, insets);

  const containerStyle = PLATFORM === "android" ? androidContainer : iOSContainer;
  return (
    <View style={containerStyle}>
      <View style={headerContainerStyle}>
        <TouchableOpacity onPress={navigation.goBack}>
          <Icon
            type={IconTypes.MATERIAL_COMMUNITY_ICONS}
            name={isRTL ? "chevron-right" : "chevron-left"}
            style={backButtonStyle}
            size={moderateScale(40)}
            color={colors.white}
            disabled
          />
          <CText color={"white"} textAlign={"center"} fontSize={17} style={titleStyle}>
            {title}
          </CText>
        </TouchableOpacity>
      </View>
      <WebView source={source} />
    </View>
  );
};

export default InAppWebPageViewer;
