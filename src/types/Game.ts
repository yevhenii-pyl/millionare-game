import { Question, UidQuestion } from "./Question";

type BasicGame = {
  id: string;
  score: number;
  status: "active" | "ended";
};

export type UiGameData = BasicGame & {
  questions: {
    uId: string;
    status: Question["status"];
  }[];
};

export type Game = BasicGame & {
  questions: UidQuestion[];
};
