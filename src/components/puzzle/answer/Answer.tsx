import React, { FC } from "react";
import { TouchableOpacity } from "react-native";

import { useTheme } from "react-native-paper";

import questionViewStyles from "../questionView/questionView.styles";
import { AnswerProps } from "../questionView/questionView.types";

import { CText, Icon, IconTypes } from "~/components/";
import { scale } from "~/utils/responsivityUtil";

export const Answer: FC<AnswerProps> = props => {
  const { text, onPress, iconName, iconColor, showIcon, submitting } = props;

  const { colors } = useTheme();

  const { answerContainer } = questionViewStyles(colors);

  return (
    <TouchableOpacity style={answerContainer} onPress={onPress} disabled={submitting}>
      <CText fontSize={12} color="gray">
        {text}
      </CText>
      {showIcon && (
        <Icon
          name={iconName}
          type={IconTypes.ION_ICONS}
          color={iconColor}
          size={scale(25)}
        />
      )}
    </TouchableOpacity>
  );
};
