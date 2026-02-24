"use client";

import { useState, useEffect } from "react";
import { useChatStore } from "@/store/chatStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { IngestState } from "@/types";
import type { AxiosError } from "axios";
import axios from "axios";

const LOADING_MESSAGES = [
  "Fetching page content...",
  "Cleaning up the text...",
  "Splitting into chunks...",
  "Generating embeddings...",
  "Almost ready...",
];

function useCyclingMessage(active: boolean) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      setIndex((prev) =>
        prev < LOADING_MESSAGES.length - 1 ? prev + 1 : prev,
      );
    }, 4000);

    return () => {
      clearInterval(interval);
      setIndex(0);
    };
  }, [active]);

  return LOADING_MESSAGES[index];
}

export function IngestForm() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<IngestState>({ status: "idle" });
  const { setChunks, setIngested, setSessionId } = useChatStore();
  const loadingMessage = useCyclingMessage(state.status === "loading");

  async function handleIngest() {
    if (!url.trim()) return;
    setState({ status: "loading" });
    try {
      const { data } = await axios.post("/api/ingest", { url });
      setChunks(data.chunks);
      setSessionId(data.sessionId);
      setIngested(true);
      setState({ status: "success" });
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      const message =
        axiosError.response?.data?.error ||
        "Failed to process the URL. Try again.";
      setState({ status: "error", error: message });
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleIngest();
  }

  const isLoading = state.status === "loading";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-zinc-100">
            Chat with any website
          </h1>
          <p className="text-zinc-400 text-sm">
            Paste a URL and ask questions about its content
          </p>
        </div>

        <div className="flex gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://yourwebsite.com"
            disabled={isLoading}
            className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-500"
          />
          <Button
            onClick={handleIngest}
            disabled={isLoading || !url.trim()}
            className="bg-white text-zinc-900 hover:bg-zinc-200 shrink-0"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Analyze"
            )}
          </Button>
        </div>

        {/* Cycling loading message */}
        {isLoading && (
          <div className="flex items-center justify-center gap-2 text-zinc-500 text-xs">
            <Loader2 size={12} className="animate-spin shrink-0" />
            <span className="transition-all duration-500">
              {loadingMessage}
            </span>
          </div>
        )}

        {state.status === "error" && (
          <p className="text-red-400 text-sm text-center">{state.error}</p>
        )}
      </div>
    </div>
  );
}
