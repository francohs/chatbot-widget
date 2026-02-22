import { Chunk } from "@/types";

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
}

export function findRelevantChunks(
  queryEmbedding: number[],
  chunks: Chunk[],
  topK = 4,
): string[] {
  return chunks
    .map((chunk) => ({
      text: chunk.text,
      score: cosineSimilarity(queryEmbedding, chunk.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((c) => c.text);
}
