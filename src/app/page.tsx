"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookie from "js-cookie";
import Image from "next/image";

import useSessionStorage from "@/hooks/useSessionStorage";
import useScreenSize from "@/hooks/useScreenSize";

import { UiGameData } from "@/types/Game";

import CTAButton from "@/components/CTAButton/CTAButton";

import styles from "./page.module.css";

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
  const { isDesktop } = useScreenSize();

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
    <div className={styles.wrapper}>
      <div className={styles.mainContainer}>
        <Image
          src="/images/hand.png"
          alt="thumbsup"
          width={isDesktop ? 624 : 285}
          height={isDesktop ? 367 : 192}
        />
        <h1 className={styles.title}>Who wants to be a millionaire?</h1>
        <CTAButton label="Start" onClick={handleStartGame} />
      </div>
    </div>
  );
}
