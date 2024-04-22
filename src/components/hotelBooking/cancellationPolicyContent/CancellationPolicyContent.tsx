import React, { useEffect, useState, useMemo } from "react";
import { View } from "react-native";

import moment from "moment";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";

import { CancellationPolicyContentProps } from "./CancellationPolicyContent.types";
import cancellationPolicyContentStyles from "./CancellationPolicyContentStyles";

import { translationService } from "~/apiServices/index";
import { CText, IconTypes, Icon, LottieActivityIndicator } from "~/components/";
import { ArticleMarkdown } from "~/components/articles";
import { MOMENT_YYY_MM_DD_HH_MM } from "~/constants/moment";

const CancellationPolicyContent = (
  props: CancellationPolicyContentProps
): JSX.Element => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { cancellationInfo } = props || {};

  const {
    remarksFormatted: remarksFormattedStringify = "",
    policies: cancellation_policies = []
  } = cancellationInfo;

  let remarksformatted = "";
  try {
    remarksformatted = JSON.parse(remarksFormattedStringify);
  } catch (error) {
    remarksformatted = "";
  }
  const [showOriginalLanguage, setShowOriginalLanguage] = useState(false);
  const [translatedText, setTranslatedText] = useState(remarksformatted);
  const [isLoading, setIsLoading] = useState(true);

  const { containerStyle, row, sectionStyle, iconStyle, loadingStyle } = useMemo(
    () => cancellationPolicyContentStyles(colors),
    [colors]
  );

  useEffect(() => {
    translationService
      .translate(
        remarksformatted
          .replaceAll("###", "$$$")
          .replaceAll("&nbsp;", "@@@")
          .replaceAll("\n", "@@@")
      )
      .then((data: string) => {
        setTranslatedText(
          data.replaceAll("$$", "###").replaceAll(
            "@",
            `
`
          )
        );
        setIsLoading(false);
      });
  }, [remarksformatted]);

  const textToDisplayMarkdown = useMemo(
    () => ({ body: showOriginalLanguage ? remarksformatted : translatedText }),
    [showOriginalLanguage, remarksformatted, translatedText]
  );
  const handleToggleDescription = () => {
    setShowOriginalLanguage(oldLanguage => !oldLanguage);
  };

  return (
    <View style={containerStyle}>
      <CText fontSize={16} fontFamily={"medium"} textAlign={"center"}>
        {t("cancellation_policy")}
      </CText>
      {isLoading ? (
        <LottieActivityIndicator style={loadingStyle} />
      ) : (
        <>
          <View style={row}>
            <CText fontSize={14}>{t("cancellation_start_from")}</CText>
            <CText fontSize={14} style={sectionStyle}>
              {`${moment(cancellation_policies[0]?.date)
                .locale("en")
                .format(MOMENT_YYY_MM_DD_HH_MM)}`}
            </CText>
            <CText fontSize={14} style={sectionStyle}>
              {`${t("will_be_charged")}`}
            </CText>
            <CText fontSize={14} style={sectionStyle}>
              {`${cancellation_policies[0]?.charge?.value} ${cancellation_policies[0]?.charge?.currency}`}
            </CText>
          </View>
          <View style={row}>
            <Icon
              name="google-translate"
              type={IconTypes.MATERIAL_COMMUNITY_ICONS}
              size={25}
              style={iconStyle}
              color={colors.text}
            />
            <CText fontSize={13} color="text">
              {`${t("translate_by_google")}, `}
              <CText fontSize={13} color="primary" onPress={handleToggleDescription}>
                {showOriginalLanguage ? t("show_translation") : t("show_original")}.
              </CText>
            </CText>
          </View>
          <View style={sectionStyle}>
            <ArticleMarkdown article={textToDisplayMarkdown} />
          </View>
        </>
      )}
    </View>
  );
};

export default CancellationPolicyContent;
