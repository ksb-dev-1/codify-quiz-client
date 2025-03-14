import { QuestionStatusEnum } from "@prisma/client";

export default async function changeQuestionStatus(
  questionId: string,
  status: QuestionStatusEnum
) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/${questionId}/status/${status}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json(); // Parse response JSON

    if (!response.ok) {
      // Return API error message instead of throwing a generic error
      return {
        success: false,
        message: data.message || "Failed to update status.",
      };
    }

    return data; // Return API response directly
  } catch (error) {
    console.error("Error updating question status:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
