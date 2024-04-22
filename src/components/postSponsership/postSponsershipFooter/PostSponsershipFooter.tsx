import React from "react";
import { View, TouchableOpacity } from "react-native";

import { useTheme } from "react-native-paper";
import { Button } from "react-native-paper";

import styles from "./PostSponsershipFooter.styles";
import {
  PostSponsershipFooterType,
  PostSponsershipFooterTagAction
} from "./PostSponsershipFooter.types";

import { CText } from "~/components/common";
import { logEvent, SPONSERSHIP_CLICKED } from "~/services/";
import { openURL } from "~/services/inappbrowser";

const PostSponsershipFooter = (props: PostSponsershipFooterType): JSX.Element => {
  const theme = useTheme();

  const { tags = [], description = "", title = "", website = "" } = props;
  const { action, label, link } = tags ?? {};

  const handleTagPressed = async () => {
    switch (action) {
      case PostSponsershipFooterTagAction.OPEN_LINK:
        const newURL = link.indexOf("://") === -1 ? "https://" + link : link;
        openURL(newURL);
        await logEvent(SPONSERSHIP_CLICKED, { source: "post_sponsership", link: newURL });
        break;

      default:
        break;
    }
  };

  const {
    tagButtonStyle,
    tagButtonLabelStyle,
    tagButtonWrapperStyle,
    sponsershipFooterWrapper,
    footerSectionStyle
  } = styles(theme);

  return (
    <TouchableOpacity style={sponsershipFooterWrapper} onPress={handleTagPressed}>
      <View style={footerSectionStyle}>
        {!!website && (
          <CText fontSize={12} fontFamily="light">
            {website}
          </CText>
        )}
        {!!title && (
          <CText fontSize={14} fontFamily="medium" color="text">
            {title}
          </CText>
        )}
        {!!description && (
          <CText fontSize={12} numberOfLines={1}>
            {description}
          </CText>
        )}
      </View>
      {!!tags && Object.keys(tags).length > 0 && (
        <View style={tagButtonWrapperStyle}>
          <Button
            mode="contained"
            onPress={handleTagPressed}
            color={theme.colors.grayFacebookBtn}
            uppercase={false}
            labelStyle={tagButtonLabelStyle}
            style={tagButtonStyle}
          >
            {label}
          </Button>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default PostSponsershipFooter;
