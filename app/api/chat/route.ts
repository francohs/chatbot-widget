import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getEmbedding } from "@/lib/embed";
import { findRelevantChunks } from "@/lib/search";
import { supabaseServer } from "@/lib/supabase/server";
import { Chunk } from "@/types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const {
    message,
    chunks,
    sessionId,
  }: { message: string; chunks: Chunk[]; sessionId: string } = await req.json();

  const queryEmbedding = await getEmbedding(message);
  const relevantChunks = findRelevantChunks(queryEmbedding, chunks);
  const context = relevantChunks.join("\n\n");

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant for this website. Answer the user's questions naturally and conversationally, as if you know this information directly.

      Never mention "the context", "the provided information", "based on the text", or any reference to how you received the information. Just answer naturally.

      If the answer is not available, say: "I don't have that information. You can contact us directly for more details."

      Information:
      ${context}`,
      },
      { role: "user", content: message },
    ],
  });

  const answer = response.choices[0].message.content ?? "";

  // Log both turns to Supabase before returning the response
  await supabaseServer.from("messages").insert([
    { session_id: sessionId, role: "user", content: message },
    { session_id: sessionId, role: "assistant", content: answer },
  ]);

  return NextResponse.json({ answer });
}
