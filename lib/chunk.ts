export function chunkText(text: string, size = 500, overlap = 50): string[] {
  const words = text.split(" ");
  const chunks: string[] = [];

  for (let i = 0; i < words.length; i += size - overlap) {
    const chunk = words.slice(i, i + size).join(" ");
    if (chunk.trim()) chunks.push(chunk);
  }

  return chunks;
}
