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

export default fetchGameData;
