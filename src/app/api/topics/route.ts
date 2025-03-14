import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(): Promise<NextResponse> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const topics = await prisma.topic.findMany();

    if (!topics.length) {
      return NextResponse.json({
        success: true,
        topics: [],
        length: 0,
      });
    }

    return NextResponse.json({
      success: true,
      topics,
      length: topics.length,
    });
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch questions",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
