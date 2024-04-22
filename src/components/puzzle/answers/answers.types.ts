import { Question } from "~/apiServices/home/home.types";

export interface AnswersProps {
  submitting: boolean;
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAnswer: React.Dispatch<React.SetStateAction<number>>;
  shuffledAnswers: any[];
  question: Question;
  selectedAnswer: number;
}
