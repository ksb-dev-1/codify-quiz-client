import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

// components
import Container from "@/components/shared/Container";
import Questions from "@/components/Questions";

export const metadata: Metadata = {
  title: "Questions",
  description: "List of questions",
};

export default async function QuestionsPageWrapper({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  // Fetch session
  const session = await auth();
  const userId = session?.user?.id;

  // If user not signed in redirect to signin page
  if (!userId) redirect("/pages/signin");

  const { page, status, difficulty, topic } = await searchParams;

  return (
    <Container>
      <Questions
        userId={userId}
        currentPage={page}
        currentStatus={status}
        currentDifficulty={difficulty}
        currentTopic={topic}
      />
    </Container>
  );
}
