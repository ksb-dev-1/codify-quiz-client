"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function saveQuestionAction(formData: FormData) {
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
    // Check if already saved
    const existingSaved = await prisma.savedQuestion.findFirst({
      where: { questionId, userId },
    });

    if (existingSaved) {
      return { success: false, message: "Question is already saved" };
    }

    // Save question
    await prisma.savedQuestion.create({
      data: { questionId, userId },
    });

    return { success: true, message: "Question saved successfully" };
  } catch (error) {
    console.error("Failed to save question:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    };
  }
}
