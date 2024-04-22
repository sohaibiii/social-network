import React, { useCallback, useMemo, memo } from "react";

import { useNavigation } from "@react-navigation/native";
import queryString from "query-string";
import isEqual from "react-fast-compare";
import Autolink from "react-native-autolink";
import { AutolinkProps } from "react-native-autolink";
import { useTheme } from "react-native-paper";
import { useSelector } from "react-redux";

import autoLinkStyles from "./AutoLink.styles";
import { Match } from "./AutoLink.types";

import { CText } from "~/components/";
import { logEvent, POST_LINK_CLICKED } from "~/services/analytics";
import { openURL } from "~/services/inappbrowser";

const AutoLink = memo((props: AutolinkProps): JSX.Element => {
  const {
    text = "",
    email = false,
    phone = false,
    hashtag = "facebook",
    truncate = 0,
    textProps = {},
    analyticsSource,
    pkey
  } = props;

  const isThemeDark = useSelector((state: RootState) => state.settings.isThemeDark);

  const navigation = useNavigation();
  const { colors } = useTheme();

  const { autoLink, linkStyle } = useMemo(() => autoLinkStyles(colors), [colors]);

  const handleLinkPressed = useCallback(
    async (match: Match, url: string) => {
      switch (match.getType()) {
        case "url":
          if (url.includes("safarway.com")) {
            const { query: { type = "", geoSlug = "" } = {} } =
              queryString.parseUrl(url) || {};

            const newURL = url.indexOf("://") === -1 ? "https://" + url : url;

            await logEvent(POST_LINK_CLICKED, { analyticsSource, url, pkey });
            openURL(newURL);
          }
          break;
        case "hashtag":
          return navigation.navigate("Hashtag", { hashtag: match.hashtag });
        default:
          break;
      }
    },
    [navigation, pkey, analyticsSource]
  );

  const renderLink = useCallback(
    (url: string, match: Match) => {
      const isLink = url.startsWith("#") || url.includes("safarway.com");

      return (
        <CText
          suppressHighlighting
          onPress={() => handleLinkPressed(match, url)}
          style={isLink ? linkStyle : {}}
          fontSize={13}
          {...textProps}
          color={isLink ? (isThemeDark ? "primary" : "primary_blue") : "text"}
        >
          {url}
        </CText>
      );
    },
    [handleLinkPressed, linkStyle, textProps, isThemeDark]
  );

  const renderText = useCallback(
    (autoLinkText: string) => {
      return (
        <CText fontSize={13} {...textProps}>
          {autoLinkText}
        </CText>
      );
    },
    [textProps]
  );

  return (
    <Autolink
      style={autoLink}
      email={email}
      phone={phone}
      truncate={truncate}
      hashtag={hashtag}
      renderLink={renderLink}
      renderText={renderText}
      text={text}
    />
  );
}, isEqual);

AutoLink.displayName = "AutoLink";

export { AutoLink };
