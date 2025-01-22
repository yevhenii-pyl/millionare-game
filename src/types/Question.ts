export type Question = {
  id: string;
  question: string;
  answerType: "single" | "multiple";
  status: "pending" | "active" | "answered";
  answers: string[];
};

export type UidQuestion = Question & {
  uId: string;
};
