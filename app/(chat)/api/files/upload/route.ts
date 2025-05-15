import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/app/(auth)/auth";

const FileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File size should be less than 5MB",
    })
    .refine(
      (file) =>
        [
          "image/jpeg",
          "image/png",
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file.type),
      {
        message: "File type should be JPEG, PNG, PDF, or DOCX",
      },
    ),
});

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (request.body === null) {
    return new Response("Request body is empty", { status: 400 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const validatedFile = FileSchema.safeParse({ file });

    if (!validatedFile.success) {
      const errorMessage = validatedFile.error.errors
        .map((error) => error.message)
        .join(", ");

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const uniqueFilename = `${Date.now()}-${validatedFile.data.file.name}`;
    const fileBuffer = await file.arrayBuffer();

    try {
      const data = await put(uniqueFilename, fileBuffer, {
        access: "public",
        contentType: validatedFile.data.file.type,
      });

      return NextResponse.json(data);
    } catch (error: unknown) {
      let errorMessage = "Unknown error during upload";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Vercel Blob upload error:", error);
      return NextResponse.json(
        { error: `Upload failed: ${errorMessage}` },
        { status: 500 },
      );
    }
  } catch (error: unknown) {
    let errorMessage = "Unknown error processing request";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Failed to process request:", error);
    return NextResponse.json(
      { error: `Failed to process request: ${errorMessage}` },
      { status: 500 },
    );
  }
}
