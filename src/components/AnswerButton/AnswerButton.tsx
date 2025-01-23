"use client";

import { useState } from "react";
import cn from "classnames";

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
  const [disabled, setDisabled] = useState(false);

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
          setDisabled(true);
        }}
        className={cn(styles.answerButton, styles.border, {
          [styles.answeredCorrectly]: answeredCorrectly && isCorrect,
          [styles.answeredWrong]:
            !answeredCorrectly && status === "answered" && selected,
        })}
        disabled={disabled || status === "answered"}
      >
        <span className={styles.questionLetter}>
          {String.fromCharCode(65 + index)}
        </span>
        <span>{label}</span>
      </button>
    </div>
  );
}

export default AnswerButton;
