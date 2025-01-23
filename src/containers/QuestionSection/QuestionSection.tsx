"use client";

import { useRouter } from "next/navigation";
import Cookie from "js-cookie";

import { Answer, UidQuestion } from "@/types/Question";
import useSessionStorage from "@/hooks/useSessionStorage";
import { UiGameData } from "@/types/Game";

import AnswerButton from "@/components/AnswerButton/AnswerButton";

import styles from "./QuestionSection.module.css";

const updateGame = async (
  gameId: string,
  uId: string,
  action: "correct" | "wrong",
  answerIndex: number,
) => {
  const response = await fetch(`/api/question/${uId}`, {
    method: "PUT",
    credentials: "same-origin",
    headers: {
      "X-Game-ID": gameId || "",
      "X-Game-Action": action,
      "X-Answer-Index": String(answerIndex),
    },
  });

  return response.json();
};

function QuestionSection({ questionData }: { questionData: UidQuestion }) {
  const { uId, question, answers, status, answeredCorrectly } = questionData;
  const router = useRouter();

  const [, setStoredGame] = useSessionStorage<UiGameData | null>("game", null);

  const handleAnswer = async (isCorrect: boolean, answerIndex: number) => {
    const cookedGameId = Cookie.get("gameId");

    if (cookedGameId) {
      try {
        if (isCorrect) {
          const gameData = await updateGame(
            cookedGameId,
            uId,
            "correct",
            answerIndex,
          );
          setStoredGame(gameData.game);

          if (gameData.nextQuestionUid) {
            router.push(`${gameData.nextQuestionUid}`);
          } else {
            router.push("/end");
          }
        } else {
          const gameData = await updateGame(
            cookedGameId,
            uId,
            "wrong",
            answerIndex,
          );
          setStoredGame(gameData.game);
          router.push("/end");
        }

        router.refresh();
      } catch (error) {
        console.error("Error updating game:", error);
      }
    }
  };

  return (
    <main className={styles.wrapper}>
      <h1 className={styles.title}>{question}</h1>
      <ul className={styles.questionsList}>
        {answers.map(
          ({ value, isCorrect, selected }: Answer, index: number) => (
            <li key={value}>
              <AnswerButton
                index={index}
                isCorrect={isCorrect}
                label={value}
                onClick={handleAnswer}
                status={status}
                answeredCorrectly={answeredCorrectly}
                selected={selected}
              />
            </li>
          ),
        )}
      </ul>
    </main>
  );
}

export default QuestionSection;
