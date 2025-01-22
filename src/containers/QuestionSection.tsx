"use client";

import { useRouter } from "next/navigation";
import Cookie from "js-cookie";

import { Answer, UidQuestion } from "@/types/Question";
import useSessionStorage from "@/hooks/useSessionStorage";
import { UiGameData } from "@/types/Game";

const updateGame = async (
  gameId: string,
  uId: string,
  action: "correct" | "wrong",
) => {
  const response = await fetch(`/api/question/${uId}`, {
    method: "PUT",
    credentials: "same-origin",
    headers: {
      "X-Game-ID": gameId || "",
      "X-Game-Action": action,
    },
  });

  return response.json();
};

function QuestionSection({ questionData }: { questionData: UidQuestion }) {
  const { uId, question, answers } = questionData;
  const router = useRouter();

  const [storedGame, setStoredGame] = useSessionStorage<UiGameData | null>(
    "game",
    null,
  );

  const gameEnded = storedGame?.status === "ended";

  if (gameEnded) {
    console.log("game is finished, smartass");
  }

  const handleAnswer = async (isCorrect: boolean) => {
    const cookedGameId = Cookie.get("gameId");

    if (cookedGameId) {
      try {
        if (isCorrect) {
          const gameData = await updateGame(cookedGameId, uId, "correct");
          setStoredGame(gameData.game);

          if (gameData.nextQuestionUid) {
            router.push(`${gameData.nextQuestionUid}`);
          } else {
            router.push("/end");
          }
        } else {
          const gameData = await updateGame(cookedGameId, uId, "wrong");
          setStoredGame(gameData.game);
          router.push("/end");
        }
      } catch (error) {
        console.error("Error updating game:", error);
      }
    }
  };

  return (
    <div className="question-section">
      <h2>{question}</h2>
      <div className="answers">
        {answers.map(({ value, isCorrect }: Answer, index: number) => (
          <button
            key={value}
            className="answer-btn"
            type="button"
            onClick={() => handleAnswer(isCorrect)}
          >
            {String.fromCharCode(65 + index)} {value}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuestionSection;
