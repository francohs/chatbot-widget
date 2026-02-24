import { NextRequest, NextResponse } from "next/server";
import { extractTextFromUrl } from "@/lib/extract";
import { chunkText } from "@/lib/chunk";
import { getEmbedding } from "@/lib/embed";
import { supabaseServer } from "@/lib/supabase/server";
import { sendUrlAlert } from "@/lib/email";

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

  const { data: session, error } = await supabaseServer
    .from("sessions")
    .insert({ source_url: url })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  await sendUrlAlert({ sessionId: session.id, sourceUrl: url });

  return NextResponse.json({
    chunks: chunksWithEmbeddings,
    sessionId: session.id,
  });
}
