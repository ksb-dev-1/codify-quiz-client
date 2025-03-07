"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function removeQuestionAction(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false, message: "Unauthorized" };
  }

  const questionId = formData.get("questionId") as string;
  if (!questionId) {
    return { success: false, message: "Invalid question ID" };
  }

  try {
    // Check if the question exists
    const existingSaved = await prisma.savedQuestion.findFirst({
      where: { questionId, userId },
    });

    if (!existingSaved) {
      return { success: false, message: "Question is not saved" };
    }

    // Remove the saved question
    await prisma.savedQuestion.delete({
      where: { id: existingSaved.id },
    });

    return { success: true, message: "Question removed successfully" };
  } catch (error) {
    console.error("Failed to remove question:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    };
  }
}
