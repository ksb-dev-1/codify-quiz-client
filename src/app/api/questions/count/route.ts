import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Fetch all counts concurrently using Promise.all
    const [
      totalQuestionsCount,
      attemptedEasyCount,
      attemptedMediumCount,
      attemptedHardCount,
      solvedEasyCount,
      solvedMediumCount,
      solvedHardCount,
      easyDifficultyCount,
      mediumDifficultyCount,
      hardDifficultyCount,
    ] = await Promise.all([
      prisma.question.count(),

      prisma.questionStatus.count({
        where: {
          userId,
          status: "ATTEMPTED",
          question: { difficulty: "EASY" },
        },
      }),
      prisma.questionStatus.count({
        where: {
          userId,
          status: "ATTEMPTED",
          question: { difficulty: "MEDIUM" },
        },
      }),
      prisma.questionStatus.count({
        where: {
          userId,
          status: "ATTEMPTED",
          question: { difficulty: "HARD" },
        },
      }),
      prisma.questionStatus.count({
        where: { userId, status: "SOLVED", question: { difficulty: "EASY" } },
      }),
      prisma.questionStatus.count({
        where: { userId, status: "SOLVED", question: { difficulty: "MEDIUM" } },
      }),
      prisma.questionStatus.count({
        where: { userId, status: "SOLVED", question: { difficulty: "HARD" } },
      }),
      prisma.question.count({ where: { difficulty: "EASY" } }),
      prisma.question.count({ where: { difficulty: "MEDIUM" } }),
      prisma.question.count({ where: { difficulty: "HARD" } }),
    ]);

    // Calculate the Todo status count for each difficulty level
    const todoEasyCount =
      easyDifficultyCount - (attemptedEasyCount + solvedEasyCount);
    const todoMediumCount =
      mediumDifficultyCount - (attemptedMediumCount + solvedMediumCount);
    const todoHardCount =
      hardDifficultyCount - (attemptedHardCount + solvedHardCount);

    // Calculate total counts
    const totalTodoCount = todoEasyCount + todoMediumCount + todoHardCount;
    const totalAttemptedCount =
      attemptedEasyCount + attemptedMediumCount + attemptedHardCount;
    const totalSolvedCount =
      solvedEasyCount + solvedMediumCount + solvedHardCount;

    return NextResponse.json({
      success: true,
      totalQuestionsCount,
      EASY: {
        todo: todoEasyCount,
        attempted: attemptedEasyCount,
        solved: solvedEasyCount,
      },
      MEDIUM: {
        todo: todoMediumCount,
        attempted: attemptedMediumCount,
        solved: solvedMediumCount,
      },
      HARD: {
        todo: todoHardCount,
        attempted: attemptedHardCount,
        solved: solvedHardCount,
      },
      totalEasyCount: easyDifficultyCount,
      totalMediumCount: mediumDifficultyCount,
      totalHardCount: hardDifficultyCount,
      totalTodoCount,
      totalAttemptedCount,
      totalSolvedCount,
    });
  } catch (error) {
    console.error("Failed to fetch questions count:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch questions count", error },
      { status: 500 }
    );
  }
}
