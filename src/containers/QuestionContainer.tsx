"use client";

import { UidQuestion } from "@/types/Question";

import QuestionSection from "./QuestionSection";

function QuestionContainer({ questionData }: { questionData: UidQuestion }) {
  return (
    <div className="game-container">
      <div className="main-content">
        <QuestionSection questionData={questionData} />
      </div>
    </div>
  );
}

export default QuestionContainer;
