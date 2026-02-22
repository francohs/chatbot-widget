"use client";

import { useState, useRef, useEffect } from "react";
import { useChatStore } from "@/store/chatStore";
import { MessageBubble } from "./MessageBubble";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import axios from "axios";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, chunks, isLoading, addMessage, setLoading, reset } =
    useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    addMessage({ role: "user", content: trimmed });
    setInput("");
    setLoading(true);

    try {
      const { data } = await axios.post("/api/chat", {
        message: trimmed,
        chunks,
      });
      addMessage({ role: "assistant", content: data.answer });
    } catch {
      addMessage({
        role: "assistant",
        content: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat Panel */}
      {isOpen && (
        <div className="w-90 h-125 bg-zinc-800 rounded-2xl shadow-2xl border border-zinc-700 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-700">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-sm font-medium text-zinc-100">
                AI Assistant
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={reset}
                className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors"
              >
                Try another URL
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 px-4 py-3">
            {messages.length === 0 && (
              <p className="text-zinc-500 text-sm text-center mt-8">
                Ask me anything about this page.
              </p>
            )}
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-zinc-500 text-sm mb-3">
                <Loader2 size={14} className="animate-spin" />
                Thinking...
              </div>
            )}
            <div ref={bottomRef} />
          </ScrollArea>

          {/* Input */}
          <div className="px-4 py-3 border-t border-zinc-700 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-500"
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              size="icon"
              className="bg-white text-zinc-900 hover:bg-zinc-200 shrink-0"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-white text-zinc-900 shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
