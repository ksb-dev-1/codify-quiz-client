import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import cloudinary from "@/config/cloudinary.config";
import { revalidatePath } from "next/cache";

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Fetch the current user image from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { image: true },
    });

    // Extract the Cloudinary public ID from the existing image URL
    if (user?.image) {
      const oldImageUrl = user.image;
      const oldImageId = oldImageUrl
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0]; // Extract the Cloudinary ID

      // Delete the existing image in Cloudinary
      await cloudinary.uploader.destroy(oldImageId, { resource_type: "image" });
    }

    // Get the uploaded file
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload the new image to Cloudinary
    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "codify" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as { secure_url: string; public_id: string });
          }
        );
        uploadStream.end(buffer);
      }
    );

    // Update user profile with the new image URL
    await prisma.user.update({
      where: { id: userId },
      data: { image: result.secure_url },
    });

    revalidatePath("/pages/profile", "page");

    return NextResponse.json({ success: true, imageUrl: result.secure_url });
  } catch (error) {
    console.error("Failed to upload image:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload image",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
