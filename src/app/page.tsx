"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookie from "js-cookie";

import useSessionStorage from "@/hooks/useSessionStorage";
import { UiGameData } from "@/types/Game";

const fetchGameData = async (): Promise<UiGameData | null> => {
  try {
    const response = await fetch("/api/game", { method: "POST" });

    if (!response.ok) {
      throw new Error("Failed to start game");
    }

    const game: UiGameData = await response.json();
    return game;
  } catch (error) {
    console.error("Error starting the game:", error);
    return null;
  }
};

export default function Home() {
  const router = useRouter();

  const [storedGame, setStoredGame] = useSessionStorage<UiGameData | null>(
    "game",
    null,
  );

  const handleStartGame = async () => {
    const game = await fetchGameData();

    if (game) {
      setStoredGame(game);
      Cookie.set("gameId", game.id, { expires: 7, path: "/" });
    }
  };

  // @dev check if there is a game instance already
  useEffect(() => {
    const cookedGameId = Cookie.get("gameId");
    if (storedGame?.id && storedGame.id === cookedGameId) {
      const unansweredQuestion = storedGame.questions.find(
        (question) => question.status === "active",
      );

      if (storedGame.status === "ended") {
        router.push("/end");
      }

      if (unansweredQuestion) {
        router.push(`/question/${unansweredQuestion?.uId}`);
      }
    }
  }, [storedGame?.id]);

  return (
    <div>
      Start Quiz Page
      <button onClick={handleStartGame} type="button">
        Start Game
      </button>
    </div>
  );
}
