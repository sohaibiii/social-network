import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { View } from "react-native";

import Config from "react-native-config";
import FastImage from "react-native-fast-image";
import { useTheme } from "react-native-paper";
import Animated, { FadeIn } from "react-native-reanimated";

import { Answers } from "../answers";

import questionViewStyles from "./questionView.styles";
import { QuestionViewProps } from "./questionView.types";

import { CText } from "~/components/";
import { shuffleArray } from "~/utils/generalUtils";
import { scale } from "~/utils/responsivityUtil";

let timeoutRef: NodeJS.Timeout;

let canSubmitAgain = true;
const QuestionView: FC<QuestionViewProps> = props => {
  const { question, submitAnswer, currentIndex, totalQuestions } = props;
  const { colors } = useTheme();

  const {
    answerContainer,
    puzzleImage,
    puzzleImageContainer,
    puzzleTitleStyle,
    root,
    imageOwnerStyle,
    counterContainer
  } = useMemo(() => questionViewStyles(colors), [colors]);

  const [submitting, setSubmitting] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(-1);

  useEffect(() => {
    if (selectedAnswer !== -1 && canSubmitAgain) {
      canSubmitAgain = false;
      timeoutRef = setTimeout(
        () => {
          if (selectedAnswer === -2) {
            submitAnswer(true, question, question.correctAnswer);
          } else {
            submitAnswer(false, question, shuffledAnswers[selectedAnswer]);
          }
          canSubmitAgain = true;
        },
        selectedAnswer === -2 ? 500 : 1500
      );
    }
    return () => {
      clearTimeout(timeoutRef);
    };
  }, [selectedAnswer, submitAnswer]);

  const shuffledAnswers = useMemo(
    () => shuffleArray([...question.incorrectAnswers, question.correctAnswer]),

    [question.incorrectAnswers, question.correctAnswer]
  );

  const AnswersCallBack = useCallback(
    () => (
      <Answers
        submitting={submitting}
        setSubmitting={setSubmitting}
        setSelectedAnswer={setSelectedAnswer}
        shuffledAnswers={shuffledAnswers}
        question={question}
        selectedAnswer={selectedAnswer}
      />
    ),

    [shuffledAnswers, answerContainer, submitting, question.correctAnswer, selectedAnswer]
  );

  return (
    <View style={root}>
      <Animated.View entering={FadeIn.duration(1000)} style={[puzzleImageContainer]}>
        <FastImage
          style={puzzleImage}
          resizeMode="cover"
          source={{
            uri: `${Config.CONTENT_MEDIA_PREFIX}/${question.image.uuid}_sm.jpg`
          }}
        />
      </Animated.View>
      <View style={puzzleTitleStyle}>
        <CText fontSize={12}>{question.text}</CText>
      </View>
      {Boolean(question.image.owner || question.image.source) && (
        <View style={imageOwnerStyle}>
          <CText fontSize={11} lineHeight={scale(12)} color="white" textAlign="center">
            {question.image.owner}
            {question.image.owner && question.image.source ? " - " : ""}
            {question.image.source}
          </CText>
        </View>
      )}
      <AnswersCallBack />
      <View style={counterContainer}>
        <CText fontSize={14} color="gray">
          {currentIndex + 1}/{totalQuestions}
        </CText>
      </View>
    </View>
  );
};

export { QuestionView };
