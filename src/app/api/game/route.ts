import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import uuid4 from "uuid4";
import AWS from "aws-sdk";

import { Question, UidQuestion } from "@/types/Question";
import { UiGameData } from "@/types/Game";

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const bucketName = process.env.AWS_S3_BUCKET_NAME;

async function POST() {
  const filePath = path.join(process.cwd(), "data", "initialConfig.json");
  const questions: Question[] = JSON.parse(
    await fs.readFile(filePath, "utf-8"),
  );

  // manageFiles();

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
    score: 0,
    status: "active",
  };

  const newGameFileName = `game-${gameId}.json`;
  const newGameContent = JSON.stringify(game, null, 2);

  if (!bucketName) {
    throw new Error("Nu such bucket");
  }

  const params = {
    Bucket: bucketName,
    Key: newGameFileName,
    Body: newGameContent,
    ContentType: "application/json",
  };

  try {
    await s3.putObject(params).promise();
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 },
    );
  }

  // @dev return game data to be stored at session storage
  // avoid sending sensitive data, like correct answers, here

  const uiGameData: UiGameData = {
    id: gameId,
    score: 0,
    status: "active",
    questions: gameQuestions.map((question: UidQuestion) => ({
      uId: question.uId,
      status: question.status,
      answeredCorrectly: question.answeredCorrectly,
    })),
  };

  return NextResponse.json({ ...uiGameData });
}

export { POST };
