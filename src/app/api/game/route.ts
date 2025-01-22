import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import uuid4 from "uuid4";

import { Question, UidQuestion } from "@/types/Question";
import { UiGameData } from "@/types/Game";

async function POST() {
  const filePath = path.join(process.cwd(), "data", "initialConfig.json");
  const questions: Question[] = JSON.parse(
    await fs.readFile(filePath, "utf-8"),
  );

  // @dev create && store new game
  const gameId = uuid4();
  const gameQuestions = questions.map(
    (question: Question): UidQuestion => ({
      uId: uuid4(),
      ...question,
    }),
  );

  const game = {
    id: gameId,
    questions: gameQuestions,
    currentQuestionIndex: 0,
    score: 0,
  };

  const newGamePath = path.join(process.cwd(), "data", `game-${gameId}.json`);
  await fs.writeFile(newGamePath, JSON.stringify(game, null, 2));

  // @dev return game data to be stored at session storage
  // avoid sending sensitive data, like correct answers, here

  const uiGameData: UiGameData = {
    id: gameId,
    currentQuestionIndex: 0,
    score: 0,
    questions: gameQuestions.map((question: UidQuestion) => ({
      uId: question.uId,
      status: question.status,
    })),
  };

  return NextResponse.json({ ...uiGameData });
}

export { POST };
