import React, { useCallback, useState } from "react";
import { View } from "react-native";

import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";

import translatedInlineReadMoreStyles from "./TranslatedInlineReadMore.styles";
import { TranslatedInlineReadMoreProps } from "./TranslatedInlineReadMore.types";

import { CText, InlineReadMore, Icon, IconTypes } from "~/components/";
import { TOGGLE_INLINE_READ_MORE_TRANSLATION, logEvent } from "~/services/";

export const TranslatedInlineReadMore = (
  props: TranslatedInlineReadMoreProps
): JSX.Element => {
  const [showOriginalLanguage, setShowOriginalLanguage] = useState(false);

  const { colors } = useTheme();
  const { t } = useTranslation();

  const {
    originalDescription = "",
    translationSource,
    description = "",
    handleCopy = () => undefined,
    analyticsSource,
    slug,
    type,
    ...restOfProps
  } = props;

  const handleToggleDescription = async () => {
    !!analyticsSource &&
      (await logEvent(TOGGLE_INLINE_READ_MORE_TRANSLATION, {
        source: analyticsSource,
        slug,
        type,
        showing_original_language: !showOriginalLanguage
      }));
    setShowOriginalLanguage(oldLanguage => !oldLanguage);
  };

  const handleCopyDescription = useCallback(() => {
    const copiedText = showOriginalLanguage ? originalDescription : description;
    handleCopy(copiedText);
  }, [handleCopy, showOriginalLanguage, originalDescription, description]);

  const [expanded, setExpanded] = useState(false);

  const realDescription = showOriginalLanguage ? originalDescription : description;
  const { flexRowCenter } = translatedInlineReadMoreStyles;
  return (
    <>
      <InlineReadMore
        key={realDescription}
        onLongPress={handleCopyDescription}
        analyticsSource={analyticsSource}
        slug={slug}
        type={type}
        isInitiallyExpanded={expanded}
        onExpanded={setExpanded}
        {...restOfProps}
      >
        {realDescription}
      </InlineReadMore>
      {!!translationSource && translationSource === "google_translate" && (
        <View style={flexRowCenter}>
          <Icon
            name="google-translate"
            type={IconTypes.MATERIAL_COMMUNITY_ICONS}
            size={25}
            color={colors.text}
          />
          <CText fontSize={13} color="text">
            {`${t("translate_by_google")}, `}
            <CText fontSize={13} color="primary" onPress={handleToggleDescription}>
              {showOriginalLanguage ? t("show_translation") : t("show_original")}.
            </CText>
          </CText>
        </View>
      )}
    </>
  );
};
