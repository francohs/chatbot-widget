import { NextRequest, NextResponse } from "next/server";
import { extractTextFromUrl } from "@/lib/extract";
import { chunkText } from "@/lib/chunk";
import { getEmbedding } from "@/lib/embed";

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  const text = await extractTextFromUrl(url);
  const chunks = chunkText(text);

  const chunksWithEmbeddings = await Promise.all(
    chunks.map(async (chunk) => ({
      text: chunk,
      embedding: await getEmbedding(chunk),
    })),
  );

  return NextResponse.json({ chunks: chunksWithEmbeddings });
}
