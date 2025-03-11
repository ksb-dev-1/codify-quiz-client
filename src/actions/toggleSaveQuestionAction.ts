"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function toggleSaveQuestionAction(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("Unauthorized");

  const questionId = formData.get("questionId") as string;
  if (!questionId) throw new Error("Invalid question Id");

  try {
    let message;
    // Check if already saved
    const existingSaved = await prisma.savedQuestion.findFirst({
      where: { questionId, userId },
    });

    if (existingSaved) {
      // ❌ If already saved, remove it
      await prisma.savedQuestion.delete({
        where: { id: existingSaved.id },
      });
      message = "Question removed successfully";
    } else {
      // ✅ If not saved, create a new saved question entry
      await prisma.savedQuestion.create({
        data: { questionId, userId },
      });
      message = "Question saved successfully";
    }

    return { success: true, message };
  } catch (error) {
    console.error("Failed to toggle saved question:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    };
  }
}
