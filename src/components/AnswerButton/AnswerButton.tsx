"use client";

import { useState } from "react";
import cn from "classnames";

import Loader from "@/components/Loader/Loader";

import styles from "./AnswerButton.module.css";

function AnswerButton({
  index,
  isCorrect,
  label,
  onClick,
  status,
  answeredCorrectly,
  selected,
}: {
  index: number;
  isCorrect: boolean;
  label: string;
  onClick: (answer: boolean, answerIndex: number) => void;
  status: "active" | "pending" | "answered";
  answeredCorrectly: boolean;
  selected: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div
      className={cn(styles.lines, {
        [styles.answeredCorrectly]: answeredCorrectly && isCorrect,
        [styles.answeredWrong]:
          !answeredCorrectly && status === "answered" && selected,
      })}
    >
      <button
        type="button"
        onClick={() => {
          onClick(isCorrect, index);
          setIsLoading(true);
        }}
        className={cn(styles.answerButton, styles.border, {
          [styles.answeredCorrectly]:
            (answeredCorrectly || isLoading) && isCorrect,
          [styles.answeredWrong]:
            (!answeredCorrectly && status === "answered" && selected) ||
            (isLoading && !isCorrect),
        })}
        disabled={isLoading || status === "answered"}
      >
        <span className={styles.questionLetter}>
          {String.fromCharCode(65 + index)}
        </span>
        {isLoading ? <Loader /> : <span>{label}</span>}
      </button>
    </div>
  );
}

export default AnswerButton;
