import { notFound } from "next/navigation";
import { TOPICS, TOPIC_BY_ID } from "@/data/topics";
import TopicOverview from "@/components/TopicOverview";

export function generateStaticParams() {
  return TOPICS.map((t) => ({ topicId: t.id }));
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = await params;
  if (!TOPIC_BY_ID[topicId]) notFound();

  return <TopicOverview topicId={topicId} />;
}
