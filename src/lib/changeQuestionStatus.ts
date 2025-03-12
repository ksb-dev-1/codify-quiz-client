import { QuestionStatusEnum } from "@prisma/client";

export default async function changeQuestionStatus(
  questionId: string,
  status: QuestionStatusEnum
) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/${questionId}/status/${status}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const jsonResponse = await response.json();
    throw new Error(
      jsonResponse.message || "Failed to set status as attempted."
    );
  }

  return response.json();
}
