import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { QuestionStatusEnum } from "@prisma/client";

export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string; status: QuestionStatusEnum }>;
  }
) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const { id, status } = await params;

    // Authorization check
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Validate questionId
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing questionId" },
        { status: 400 }
      );
    }

    // Check status of the question
    const questionStatus = await prisma.questionStatus.findFirst({
      where: { questionId: id, userId },
    });

    if (questionStatus) {
      // Update existing status
      await prisma.questionStatus.update({
        where: { id: questionStatus.id },
        data: { status },
      });
    } else {
      // Create new status record
      await prisma.questionStatus.create({
        data: { questionId: id, userId, status },
      });
    }

    return NextResponse.json(
      { success: true, message: "Success" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update question status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update question status",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
