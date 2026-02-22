import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getEmbedding } from "@/lib/embed";
import { findRelevantChunks } from "@/lib/search";
import { Chunk } from "@/types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { message, chunks }: { message: string; chunks: Chunk[] } =
    await req.json();

  const queryEmbedding = await getEmbedding(message);
  const relevantChunks = findRelevantChunks(queryEmbedding, chunks);

  const context = relevantChunks.join("\n\n");

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant. Answer questions based ONLY on the context below. If the answer is not in the context, say you don't know.\n\nContext:\n${context}`,
      },
      { role: "user", content: message },
    ],
  });

  return NextResponse.json({
    answer: response.choices[0].message.content,
  });
}
