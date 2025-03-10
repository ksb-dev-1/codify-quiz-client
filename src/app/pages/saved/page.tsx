import { Metadata } from "next";

// components
import Container from "@/components/shared/Container";
import SavedQuestionList from "@/components/SavedQuestionList";

export const metadata: Metadata = {
  title: "Saved",
  description: "List of saved questions by user",
};

export default function SavedPage() {
  return (
    <Container>
      <SavedQuestionList />
    </Container>
  );
}
