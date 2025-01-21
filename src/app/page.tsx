"use client";

export default function Home() {
  const handleStartGame = async () => {
    try {
      const game = await fetch("/api/game", { method: "POST" });

      if (!game.ok) {
        throw new Error("Failed to start game");
      }
    } catch (error) {
      console.error("Error starting the game:", error);
    }
  };

  return (
    <div>
      Start Quiz Page
      <button onClick={handleStartGame} type="button">
        Start Game
      </button>
    </div>
  );
}
