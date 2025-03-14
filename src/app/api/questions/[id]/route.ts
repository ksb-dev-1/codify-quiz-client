import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const { id } = await params;

    // Authorization check
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check questionId
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing questionId" },
        { status: 400 }
      );
    }

    // Fetch the question
    const question = await prisma.question.findUnique({
      where: { id },
      select: {
        id: true,
        qNo: true,
        question: true,
        codeSnippet: true,
        options: true,
        correctOption: true,
        explanation: true,
        difficulty: true,
        isPremium: true,
        topic: { select: { name: true } },
      },
    });

    if (!question) {
      return NextResponse.json(
        {
          success: false,
          message: `No question found with the ID ${id}}`,
        },
        { status: 404 }
      );
    }

    // Extract topicName separately and remove topic object
    const { topic, ...questionData } = question;
    const topicName = topic?.name || "";

    // Check if the question is saved by the user
    const isQuestionSaved = await prisma.savedQuestion.findFirst({
      where: { questionId: id, userId },
    });

    // Check status of the question
    const questionStatus = await prisma.questionStatus.findFirst({
      where: { questionId: id, userId },
    });

    return NextResponse.json(
      {
        success: true,
        question: {
          ...questionData,
          topicName,
        },
        status: questionStatus?.status || "TODO",
        isSaved: Boolean(isQuestionSaved),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch question:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch question",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
