import { NextResponse } from "next/server";
import AWS from "aws-sdk";

import { UidQuestion } from "@/types/Question";
import { UiGameData } from "@/types/Game";

const s3 = new AWS.S3();
const bucketName = process.env.AWS_S3_BUCKET_NAME;

async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const gameId = req.headers.get("X-Game-ID");
  const { id: questionId } = await params;

  if (!gameId) {
    return NextResponse.json({ error: "Game ID is missing" }, { status: 400 });
  }

  if (!bucketName) {
    throw new Error("Nu such bucket");
  }

  const fileName = `game-${gameId}.json`;

  const awsParams = {
    Bucket: bucketName,
    Key: fileName,
  };

  let game;

  try {
    const data = await s3.getObject(awsParams).promise();
    game = JSON.parse(data.Body!.toString("utf-8"));
  } catch (error) {
    console.error("Error reading file from S3:", error);
  }

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

async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

  if (!bucketName) {
    throw new Error("Nu such bucket");
  }

  const fileName = `game-${gameId}.json`;

  const awsParams = {
    Bucket: bucketName,
    Key: fileName,
  };

  let game;

  try {
    const data = await s3.getObject(awsParams).promise();
    game = JSON.parse(data.Body!.toString("utf-8"));
  } catch (error) {
    console.error("Error reading file from S3:", error);
  }

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

  const uploadParams = {
    Bucket: bucketName,
    Key: fileName,
    Body: JSON.stringify(game),
    ContentType: "application/json",
  };

  await s3.putObject(uploadParams).promise();

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
