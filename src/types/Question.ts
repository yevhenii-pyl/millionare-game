export type Answer = {
  value: string;
  isCorrect: boolean;
};

export type Question = {
  id: string;
  question: string;
  answerType: "single" | "multiple";
  status: "pending" | "active" | "answered";
  answers: Answer[];
};

export type UidQuestion = Question & {
  uId: string;
};
