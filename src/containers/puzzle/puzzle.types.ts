import { Question } from "~/apiServices/home/home.types";

export interface PuzzleProps {
  data: number | Question[];
  pkey: string;
  time: number | null;
}
