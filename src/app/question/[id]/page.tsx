import { cookies } from "next/headers";

import QuestionContainer from "@/containers/QuestionContainer";
import { UidQuestion } from "@/types/Question";

async function getQuestion(id: string): Promise<UidQuestion> {
  const cookieStore = await cookies();
  const gameId = cookieStore.get("gameId")?.value;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/question/${id}`,
    {
      method: "GET",
      credentials: "same-origin",
      headers: {
        "X-Game-ID": gameId || "",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch the question");
  }

  const questionData: UidQuestion = await response.json();

  return questionData;
}

export default async function QuestionPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  let questionData;
  try {
    questionData = await getQuestion(id);
  } catch (error) {
    console.error("Error fetching question data:", error);
  }

  if (!questionData) {
    // TODO: error handler
    return <div>Nope</div>;
  }

  return <QuestionContainer questionData={questionData} />;
}
