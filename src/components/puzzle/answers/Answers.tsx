import React, { FC } from "react";

import { Answer } from "../";

import { AnswersProps } from "./answers.types";

const Answers: FC<AnswersProps> = props => {
  const {
    submitting,
    setSubmitting,
    setSelectedAnswer,
    shuffledAnswers,
    question,
    selectedAnswer
  } = props;

  const onCorrectAnswerPress = () => {
    if (!submitting) {
      setSubmitting(true);
      setSelectedAnswer(-2);
    }
  };

  const onAnswerPress = (index: number) => () => {
    if (!submitting) {
      setSubmitting(true);
      setSelectedAnswer(index);
    }
  };

  return (
    <>
      {shuffledAnswers.map((answer, index) =>
        answer === question.correctAnswer ? (
          <Answer
            key={answer}
            text={question.correctAnswer}
            onPress={onCorrectAnswerPress}
            iconName="checkmark-circle"
            iconColor="green"
            showIcon={selectedAnswer !== -1}
            submitting={submitting}
          />
        ) : (
          <Answer
            key={answer}
            text={answer}
            onPress={onAnswerPress(index)}
            iconName="close-circle"
            iconColor="red"
            showIcon={selectedAnswer === index}
          />
        )
      )}
    </>
  );
};

export default Answers;
