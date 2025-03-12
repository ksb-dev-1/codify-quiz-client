import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import cloudinary from "@/config/cloudinary.config";

// Define the Cloudinary response type
type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
};

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Missing file or userId" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "No image selected or invalid file" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.image) {
      const oldImageUrl = user.image;
      const oldImageId = oldImageUrl
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0];
      await cloudinary.uploader.destroy(oldImageId, { resource_type: "image" });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Explicitly type the result
    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "codify" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result as CloudinaryUploadResult); // Cast the result to the correct type
            }
          }
        );
        uploadStream.end(buffer);
      }
    );

    await prisma.user.update({
      where: { id: userId },
      data: { image: result.secure_url },
    });

    return NextResponse.json(
      { success: true, imageUrl: result.secure_url },
      { status: 200 }
    );
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
};
