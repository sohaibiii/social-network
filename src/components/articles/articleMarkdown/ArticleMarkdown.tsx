import React, { memo, useCallback } from "react";
import { View, ViewStyle } from "react-native";

import FastImage from "react-native-fast-image";
import Markdown from "react-native-markdown-display";
import { Text, useTheme } from "react-native-paper";

import styles from "./ArticleMarkdown.styles";

import { Article } from "~/apiServices/article/article.types";
import { logEvent, ARTICLE_LINK_VISITED } from "~/services/analytics";
import { handleHashTagPressed } from "~/services/hashtag";
import { getParamsFromHashtagUrl } from "~/utils/generalUtils";

const ArticleMarkdown = ({
  article,
  containerStyle = {},
  slug
}: {
  article: Article;
  containerStyle?: ViewStyle;
  slug: string;
}) => {
  const theme = useTheme();

  const {
    wrapperStyle,
    bodyStyle,
    strongStyle,
    heading1Style,
    heading2Style,
    heading3Style,
    heading4Style,
    heading5Style,
    heading6Style,
    linkStyle,
    imageStyle,
    imageWrapperStyle
  } = styles(theme);

  const handleLinkPressed = useCallback(async (node: any) => {
    const [type, geo, query] = getParamsFromHashtagUrl(node.attributes.href) || [];
    await logEvent(ARTICLE_LINK_VISITED, {
      source: "article_details_page",
      type,
      geo,
      query,
      slug
    });
    handleHashTagPressed(type, geo, query);
  }, []);

  const rules = {
    link: (node: any, children: any, parent: any, styles: any) => {
      return (
        <Text key={node.key} style={styles.link} onPress={() => handleLinkPressed(node)}>
          {children}
        </Text>
      );
    },
    image: (node: any, children: any, parent: any, styles: any) => {
      return (
        <View key={node.key} style={styles.imageWrapperStyle}>
          <FastImage
            style={styles.image}
            source={{
              uri: node.attributes.src
            }}
          />
        </View>
      );
    }
  };
  const markdownStyle = {
    body: bodyStyle,
    strong: strongStyle,
    heading1: heading1Style,
    heading2: heading2Style,
    heading3: heading3Style,
    heading4: heading4Style,
    heading5: heading5Style,
    heading6: heading6Style,
    link: linkStyle,
    image: imageStyle,
    imageWrapperStyle: imageWrapperStyle
  };

  const wrapperStyles = [wrapperStyle, containerStyle];
  return (
    <View style={wrapperStyles}>
      <Markdown rules={rules} style={markdownStyle}>
        {article?.body}
      </Markdown>
    </View>
  );
};

export default memo(ArticleMarkdown);
