import { create } from "zustand";
import { Message, Chunk } from "@/types";

interface ChatStore {
  messages: Message[];
  chunks: Chunk[];
  isLoading: boolean;
  isIngested: boolean;
  sessionId: string | null;
  addMessage: (message: Message) => void;
  setChunks: (chunks: Chunk[]) => void;
  setLoading: (value: boolean) => void;
  setIngested: (value: boolean) => void;
  setSessionId: (id: string) => void;
  reset: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  chunks: [],
  isLoading: false,
  isIngested: false,
  sessionId: null,
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setChunks: (chunks) => set({ chunks }),
  setLoading: (value) => set({ isLoading: value }),
  setIngested: (value) => set({ isIngested: value }),
  setSessionId: (id) => set({ sessionId: id }),
  reset: () =>
    set({
      messages: [],
      chunks: [],
      isLoading: false,
      isIngested: false,
      sessionId: null,
    }),
}));
