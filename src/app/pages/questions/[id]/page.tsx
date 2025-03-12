import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

// components
import Container from "@/components/shared/Container";
import QuestionDetail from "@/components/QuestionDetail";

export const metadata: Metadata = {
  title: "Question Detail",
  description: "Question Detail",
};

export default async function QuestionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Fetch session
  const session = await auth();
  const userId = session?.user?.id;

  // If user not signed in redirect to signin page
  if (!userId) redirect("/pages/signin");

  const { id } = await params;

  return (
    <Container>
      <QuestionDetail questionId={id} />
    </Container>
  );
}
