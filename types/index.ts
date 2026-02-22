export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface Chunk {
  text: string;
  embedding: number[];
}

export interface IngestState {
  status: "idle" | "loading" | "success" | "error";
  error?: string;
}
