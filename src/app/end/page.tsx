"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookie from "js-cookie";
import Image from "next/image";

import { UiGameData } from "@/types/Game";

import useSessionStorage from "@/hooks/useSessionStorage";
import useScreenSize from "@/hooks/useScreenSize";

import CTAButton from "@/components/CTAButton/CTAButton";

import convertIndex from "@/helpers/convertIndexes";
import fetchGameData from "@/actions/fetchGame";

import styles from "./page.module.css";

export default function GameOverPage() {
  const router = useRouter();
  const { isDesktop } = useScreenSize();

  const [storedGame, setStoredGame] = useSessionStorage<UiGameData | null>(
    "game",
    null,
  );

  const handleStartNewGame = async () => {
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

      if (unansweredQuestion && storedGame.status !== "ended") {
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
        <div className={styles.scoreContainer}>
          <h4 className={styles.scoreTitle}>Total score:</h4>
          <h1 className={styles.title}>
            ${convertIndex(storedGame?.score || 0, false)} earned
          </h1>
        </div>
        <CTAButton label="Try again" onClick={handleStartNewGame} />
      </div>
    </div>
  );
}
