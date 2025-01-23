import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

import { UidQuestion } from "@/types/Question";
import { Game, UiGameData } from "@/types/Game";

async function GET(req: Request, { params }: { params: { id: string } }) {
  const gameId = req.headers.get("X-Game-ID");
  const { id: questionId } = await params;

  if (!gameId) {
    return NextResponse.json({ error: "Game ID is missing" }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "data", `game-${gameId}.json`);
  const game: Game = JSON.parse(await fs.readFile(filePath, "utf-8"));

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  const question = game?.questions.find(
    (q: UidQuestion) => q.uId === questionId,
  );

  if (!question) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  return NextResponse.json({ ...question });
}

async function PUT(req: Request, { params }: { params: { id: string } }) {
  const gameId = req.headers.get("X-Game-ID");
  const action = req.headers.get("X-Game-Action");
  const answerIndex = req.headers.get("X-Answer-Index");
  const { id: questionId } = await params;

  if (!gameId) {
    return NextResponse.json({ error: "Game ID is missing" }, { status: 400 });
  }

  if (!action) {
    return NextResponse.json(
      { error: "Game action is missing" },
      { status: 400 },
    );
  }

  const filePath = path.join(process.cwd(), "data", `game-${gameId}.json`);
  const game: Game = JSON.parse(await fs.readFile(filePath, "utf-8"));

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  const questionIndex = game.questions.findIndex(
    (q: UidQuestion) => q.uId === questionId,
  );

  if (questionIndex === -1) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  game.questions[questionIndex].status = "answered";

  const nextQuestion = game.questions[questionIndex + 1];
  if (nextQuestion) {
    nextQuestion.status = "active";
  } else {
    game.status = "ended";
  }

  if (action === "correct") {
    game.score += 1;
    game.questions[questionIndex].answeredCorrectly = true;
  }

  if (action === "wrong") {
    game.status = "ended";
  }

  game.questions[questionIndex].answers[Number(answerIndex)].selected = true;

  await fs.writeFile(filePath, JSON.stringify(game, null, 2));

  const uiGameData: UiGameData = {
    id: gameId,
    score: game.score,
    status: game.status,
    questions: game.questions.map((question: UidQuestion) => ({
      uId: question.uId,
      status: question.status,
      answeredCorrectly: question.answeredCorrectly,
    })),
  };

  return NextResponse.json({
    nextQuestionUid: nextQuestion ? nextQuestion.uId : null,
    game: uiGameData,
  });
}

export { GET, PUT };
