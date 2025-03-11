import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const { id } = await params;

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

    let message;
    // Check if already saved
    const existingSaved = await prisma.savedQuestion.findFirst({
      where: { questionId: id, userId },
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
        data: { questionId: id, userId },
      });
      message = "Question saved successfully";
    }
    return NextResponse.json({ success: true, message }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch saved questions:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch saved questions",
        error: error instanceof Error ? error.message : "Unknown error",
        status: "error",
      },
      { status: 500 }
    );
  }
}
