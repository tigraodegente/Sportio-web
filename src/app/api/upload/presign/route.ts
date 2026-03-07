import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { generatePresignedUploadUrl, type UploadCategory } from "@/server/lib/storage";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { fileName, contentType, fileSize, category } = await req.json();

  if (!fileName || !contentType || !fileSize || !category) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const validCategories: UploadCategory[] = ["avatar", "post", "tournament", "creator", "chat", "verification"];
  if (!validCategories.includes(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  try {
    const result = await generatePresignedUploadUrl({
      userId: session.user.id,
      category,
      fileName,
      contentType,
      fileSize,
    });
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
