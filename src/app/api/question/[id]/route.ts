import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

import { UidQuestion } from "@/types/Question";
import { Game } from "@/types/Game";

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

export { GET };
