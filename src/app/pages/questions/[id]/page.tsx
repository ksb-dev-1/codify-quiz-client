import { Suspense } from "react";
import { Metadata } from "next";

// components
import Container from "@/components/shared/Container";
import QuestionDetail from "@/components/QuestionDetail";

export const metadata: Metadata = {
  title: "Question Detail",
  description: "Question Detail",
};

export default function QuestionDetailPage() {
  return (
    <Container>
      <Suspense>
        <QuestionDetail />
      </Suspense>
    </Container>
  );
}
