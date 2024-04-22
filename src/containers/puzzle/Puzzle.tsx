import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { ActivityIndicator, unstable_batchedUpdates, View } from "react-native";

import { useNavigation } from "@react-navigation/core";
import moment from "moment";
import Config from "react-native-config";
import FastImage from "react-native-fast-image";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import puzzleStyles from "./puzzle.styles";
import { PuzzleProps } from "./puzzle.types";

import { RootState } from "~/redux/store";

import homeServices from "~/apiServices/home";
import { IPuzzle, Question } from "~/apiServices/home/home.types";
import IMAGES from "~/assets/images";
import { Button, CText } from "~/components/common";
import { Icon, IconTypes, showAlert } from "~/components/common";
import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import { QuestionView } from "~/components/puzzle";
import { isRTL } from "~/constants/variables";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import {
  logEvent,
  PUZZLE_STARTED,
  PUZZLE_FINISHED,
  PUZZLE_TRY_AGAIN_PRESSED,
  PUZZLE_SIGNUP_PRESSED,
  PUZZLE_GO_TO_BOP_PRESSED,
  PUZZLE_TRY_AGAIN_BEFORE_FINISH_PRESSED
} from "~/services/analytics";
import { translate } from "~/translations/swTranslator";
import { moderateScale } from "~/utils/";
import { shuffleArray } from "~/utils/generalUtils";

const ANALYTICS_SOURCE = "homepage_puzzle";

const Puzzle: FC<PuzzleProps> = props => {
  const { data, pkey, time } = props;

  const [timeTillNextPuzzle, setTimeTillNextPuzzle] = useState(0);
  const [puzzle, setPuzzle] = useState<IPuzzle>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [winningPoints, setWinningPoints] = useState(0);
  const [puzzleShouldReload, setPuzzleShouldReload] = useState(false);

  const userToken = useSelector((state: RootState) => state.auth.userToken);

  const { colors } = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {
    root,
    finalButtonStyle,
    finalButtonLabelStyle,
    timeTillNextPuzzleRoot,
    timeTillNextPuzzleContainer,
    puzzleRoot,
    answersText,
    puzzleImage,
    resultContainer,
    puzzleWrapperStyle,
    puzzleTextWrapperStyle,
    reloadButtonContainerStyle,
    reloadButtonIconStyle
  } = puzzleStyles(colors);

  useEffect(() => {
    if (!puzzleShouldReload) {
      return;
    }
    onTryAgainPress();
    setPuzzleShouldReload(false);
  }, [puzzleShouldReload]);

  useEffect(() => {
    if (!data) return;
    const puzzleData: IPuzzle = {
      questions: data.map((question: any, index: number) => ({
        pkey: String(question.pkey ?? index),
        correctAnswer: question.correct_answer,
        incorrectAnswers: question.incorrect_answers,
        image: {
          uuid: question.image.image_uuid,
          source: question.image.source ?? "",
          owner: question.image.owner ?? ""
        },
        text: question.text,
        country: question.country ?? "",
        region: question.region ?? "",
        city: question.city ?? "",
        property: question.property ?? ""
      })),
      pkey: pkey
    };

    if (time) {
      setTimeTillNextPuzzle(time);
    } else {
      const shuffledPuzzle: IPuzzle = {
        pkey: puzzleData.pkey,
        questions: shuffleArray(puzzleData.questions)
      };
      FastImage.preload(
        shuffledPuzzle.questions.map(question => ({
          uri: `${Config.CONTENT_MEDIA_PREFIX}/${question.image.uuid}_sm.jpg`
        }))
      );
      setPuzzle(shuffledPuzzle);
    }
  }, []);

  useEffect(() => {
    if (currentIndex > 0 && puzzle && currentIndex === puzzle.questions.length) {
      if (!userToken) {
        return setWinningPoints(-2);
      }

      homeServices
        .puzzleResultRequest(puzzle.pkey, correctAnswersCount)
        .then(points => {
          setWinningPoints(points);
          return logEvent(PUZZLE_FINISHED, {
            source: ANALYTICS_SOURCE,
            puzzle_id: puzzle?.pkey,
            points: points > 0 ? points : winningPoints,
            correct_answers_count:
              points > 0 ? puzzle?.questions?.length : correctAnswersCount,
            status: points > 0 ? "won" : "lost"
          });
        })
        .catch(error => {
          dispatch(
            showSnackbar({
              text: translate("something_went_wrong"),
              type: SnackbarVariations.TOAST,
              duration: 2000,
              backgroundColor: "red"
            })
          );
        });
    }
  }, [correctAnswersCount, currentIndex, userToken, puzzle, dispatch]);

  const onSubmitAnswer = async (
    isCorrect: boolean,
    question: Question,
    selectedAnswer: string
  ) => {
    const { text = "", correctAnswer = "", pkey = "" } = question || {};
    if (currentIndex === 0) {
      await logEvent(PUZZLE_STARTED, {
        source: ANALYTICS_SOURCE,
        puzzle_id: puzzle?.pkey
      });
    }
    if (isCorrect) {
      setCorrectAnswersCount(oldValue => oldValue + 1);
    }

    await logEvent(`puzzle_question_${currentIndex + 1}_answered`, {
      source: ANALYTICS_SOURCE,
      puzzle_id: puzzle?.pkey,
      answered_questions: currentIndex + 1,
      correct_answers_count: isCorrect ? correctAnswersCount + 1 : correctAnswersCount,
      question: text,
      question_id: pkey,
      correct_answer: correctAnswer,
      selected_answer: selectedAnswer,
      answer_status: isCorrect ? "correct" : "wrong"
    });

    setCurrentIndex(oldValue => oldValue + 1);
  };

  const CurrentQuestion = useCallback(
    () =>
      puzzle && currentIndex < puzzle.questions.length ? (
        <QuestionView
          key={String(puzzle.questions[currentIndex].pkey)}
          question={puzzle.questions[currentIndex]}
          totalQuestions={puzzle.questions.length}
          currentIndex={currentIndex}
          submitAnswer={onSubmitAnswer}
        />
      ) : (
        <></>
      ),
    [currentIndex, puzzle]
  );

  const onTryAgainPress = async () => {
    const tryAgainEvent =
      currentIndex < puzzle?.questions.length
        ? PUZZLE_TRY_AGAIN_BEFORE_FINISH_PRESSED
        : PUZZLE_TRY_AGAIN_PRESSED;
    await logEvent(tryAgainEvent, {
      source: ANALYTICS_SOURCE,
      puzzle_id: puzzle?.pkey,
      correct_answers_count: correctAnswersCount,
      answered_questions_count: currentIndex
    });

    const shuffledPuzzle: IPuzzle = {
      pkey: puzzle?.pkey ?? "",
      questions: shuffleArray(puzzle?.questions ?? [])
    };
    unstable_batchedUpdates(() => {
      setPuzzle(shuffledPuzzle);
      setCorrectAnswersCount(0);
      setWinningPoints(0);
      setCurrentIndex(0);
    });
  };

  const handleRestartPuzzleCb = useCallback(() => {
    showAlert(translate("try_again_2"), translate("puzzle_try_again_message"), [
      {
        text: translate("cancel"),
        style: "cancel"
      },
      {
        text: translate("confirm"),
        onPress: () => {
          setPuzzleShouldReload(true);
        }
      }
    ]);
  }, [dispatch]);

  const navigateToPointsBank = async () => {
    await logEvent(PUZZLE_GO_TO_BOP_PRESSED, {
      source: ANALYTICS_SOURCE,
      puzzle_id: puzzle?.pkey
    });
    navigation.navigate("PointsBank");
  };

  const onSignUpPress = async () => {
    await logEvent(PUZZLE_SIGNUP_PRESSED, { source: ANALYTICS_SOURCE });
    navigation.navigate("MyProfile");
  };

  const FinalText = useCallback(() => {
    if (winningPoints === -1) {
      return (
        <>
          <View style={root}>
            <CText textAlign="center" fontSize={16}>
              {translate("you_missed_some_correct_answers")}
            </CText>
          </View>

          <Button
            title={translate("try_again_2")}
            style={finalButtonStyle}
            labelStyle={finalButtonLabelStyle}
            onPress={onTryAgainPress}
          />
        </>
      );
    } else if (winningPoints > -1) {
      return (
        <View style={root}>
          {winningPoints > 0 ? (
            <>
              <CText textAlign="center" fontSize={16}>
                {translate("congratulations_you_won")}{" "}
                {translate("points", { count: winningPoints })}
              </CText>

              <Button
                title={translate("entry_points_bank")}
                style={finalButtonStyle}
                labelStyle={finalButtonLabelStyle}
                onPress={navigateToPointsBank}
              />
            </>
          ) : (
            <ActivityIndicator animating size="large" color={colors.primary} />
          )}
        </View>
      );
    }

    return (
      <>
        <View style={root}>
          <CText fontSize={16} textAlign="center">
            {translate("register_now_earn_points")}
          </CText>
        </View>

        <Button
          title={translate("registerNow")}
          style={finalButtonStyle}
          labelStyle={finalButtonLabelStyle}
          onPress={onSignUpPress}
        />
      </>
    );
  }, [navigation, puzzle?.pkey, puzzle?.questions, winningPoints]);

  if (timeTillNextPuzzle > 0) {
    const time = moment(Number(moment().locale("en").format("x")) + timeTillNextPuzzle)
      .locale("en")
      .format(`DD/MM/YYYY ${isRTL ? "الساعة" : ""}: HH:mm`);

    return (
      <View style={timeTillNextPuzzleRoot}>
        <View style={timeTillNextPuzzleContainer}>
          <CText textAlign="center" fontSize={16}>
            {translate("next_puzzle_at")}
            {"\n"}
            {time}
          </CText>

          <Button
            title={translate("entry_points_bank")}
            style={finalButtonStyle}
            labelStyle={finalButtonLabelStyle}
            onPress={navigateToPointsBank}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={puzzleWrapperStyle}>
      <View style={puzzleTextWrapperStyle}>
        <CText color="black" fontSize={14}>
          {translate("solve_puzzle_and_win")}
        </CText>
        {currentIndex !== puzzle?.questions.length && (
          <TouchableOpacity onPress={handleRestartPuzzleCb}>
            <View style={reloadButtonContainerStyle}>
              <Icon
                type={IconTypes.MATERIAL_COMMUNITY_ICONS}
                name="reload"
                size={moderateScale(16)}
                color={colors.white}
                style={reloadButtonIconStyle}
              />
              <CText color="white" fontSize={13}>
                {translate("try_again_2")}
              </CText>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {puzzle && (
        <View>
          {currentIndex === puzzle.questions.length || timeTillNextPuzzle !== 0 ? (
            <View style={puzzleRoot}>
              <FastImage style={puzzleImage} resizeMode="cover" source={IMAGES.puzzle} />
              <View style={resultContainer}>
                <CText>
                  <CText style={answersText} color={"primary"} fontFamily="thin">
                    {correctAnswersCount}
                  </CText>
                  /{puzzle.questions.length}
                </CText>
              </View>
              <FinalText />
            </View>
          ) : (
            <CurrentQuestion />
          )}
        </View>
      )}
    </View>
  );
};

export default memo(Puzzle);
