import React from "react";
import { TouchableOpacity, View } from "react-native";

import { useTheme } from "react-native-paper";

import ruleSectionStyle from "./RuleSection.style";
import { RuleSectionTypes } from "./RuleSection.types";

import { CText, Icon, IconTypes } from "~/components/";
import { scale } from "~/utils/";

const RuleSection = (props: RuleSectionTypes): JSX.Element => {
  const { colors } = useTheme();

  const {
    title = "",
    description = "",
    icon = "heart",
    clickableText = "",
    onClickableTextPressed = () => undefined
  } = props;

  const { containerStyle, textStyle, row } = ruleSectionStyle;

  if (!description) {
    return <View />;
  }

  return (
    <View style={containerStyle}>
      <Icon
        name={icon}
        type={IconTypes.SAFARWAY_ICONS}
        width={scale(23)}
        height={scale(23)}
        color={colors.text}
      />
      <View style={textStyle}>
        <CText fontSize={15}>{title}</CText>
        <View style={row}>
          {clickableText ? (
            <CText fontSize={13}>
              {`${description} `}
              <TouchableOpacity onPress={onClickableTextPressed}>
                <CText color={"primary"} fontSize={13}>
                  {clickableText}
                </CText>
              </TouchableOpacity>
            </CText>
          ) : (
            <CText fontSize={13}>{description}</CText>
          )}
        </View>
      </View>
    </View>
  );
};
export default RuleSection;
