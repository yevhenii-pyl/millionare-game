import { UidQuestion } from "@/types/Question";

function QuestionContainer({ question }: { question: UidQuestion }) {
  return <div>{question.status}</div>;
}

export default QuestionContainer;
