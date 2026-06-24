import { notFound } from "next/navigation";
import { TOPICS, TOPIC_BY_ID } from "@/data/topics";
import { QUESTIONS, QUESTION_BY_ID } from "@/data/questions";
import QuestionView from "@/components/QuestionView";

export function generateStaticParams() {
  return QUESTIONS.map((q) => ({
    topicId: q.topicId,
    questionId: q.id,
  }));
}

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ topicId: string; questionId: string }>;
}) {
  const { topicId, questionId } = await params;
  const topic = TOPIC_BY_ID[topicId];
  const question = QUESTION_BY_ID[questionId];
  if (!topic || !question || question.topicId !== topicId) notFound();

  return <QuestionView topicId={topicId} questionId={questionId} />;
}
