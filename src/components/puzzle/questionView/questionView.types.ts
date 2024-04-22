import { Question } from "~/apiServices/home/home.types";

export interface QuestionViewProps {
  question: Question;
  submitAnswer: (isCorrect: boolean, question: Question, selectedAnswer: string) => void;
  currentIndex: number;
  totalQuestions: number;
}

export interface AnswerProps {
  text: string;
  onPress: () => void;
  iconName: string;
  iconColor: string;
  showIcon: boolean;
  submitting?: boolean;
}
