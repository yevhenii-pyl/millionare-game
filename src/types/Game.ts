import { Question, UidQuestion } from "./Question";

export type UiGameData = {
  id: string;
  currentQuestionIndex: number;
  score: number;
  questions: {
    uId: string;
    status: Question["status"];
  }[];
};

export type Game = {
  id: string;
  questions: UidQuestion[];
  currentQuestionIndex: number;
  score: number;
};
