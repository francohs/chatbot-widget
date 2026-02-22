import { create } from "zustand";
import { Message, Chunk } from "@/types";

interface ChatStore {
  messages: Message[];
  chunks: Chunk[];
  isLoading: boolean;
  isIngested: boolean;
  addMessage: (message: Message) => void;
  setChunks: (chunks: Chunk[]) => void;
  setLoading: (value: boolean) => void;
  setIngested: (value: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  chunks: [],
  isLoading: false,
  isIngested: false,
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setChunks: (chunks) => set({ chunks }),
  setLoading: (value) => set({ isLoading: value }),
  setIngested: (value) => set({ isIngested: value }),
}));
