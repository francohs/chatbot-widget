"use client";

import { IngestForm } from "@/components/IngestForm";
import { ChatWidget } from "@/components/ChatWidget";
import { useChatStore } from "@/store/chatStore";

export default function Home() {
  const { isIngested } = useChatStore();

  return (
    <main className="bg-zinc-950 min-h-screen">
      {!isIngested ? (
        <IngestForm />
      ) : (
        <>
          {/* Placeholder content simulating a real website */}
          <div className="flex flex-col items-center justify-center min-h-screen">
            <p className="text-zinc-500 text-sm">
              Website content loaded. Try the chat widget →
            </p>
          </div>
          <ChatWidget />
        </>
      )}
    </main>
  );
}
