export type Answer = {
  value: string;
  isCorrect: boolean;
  selected: boolean;
};

export type Question = {
  id: string;
  question: string;
  answerType: "single" | "multiple";
  status: "pending" | "active" | "answered";
  answeredCorrectly: boolean;
  answers: Answer[];
};

export type UidQuestion = Question & {
  uId: string;
};
