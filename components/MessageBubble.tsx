import { Message } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  message: Message;
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full mb-3",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-xs mr-2 shrink-0 mt-1">
          AI
        </div>
      )}
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed",
          isUser
            ? "bg-white text-zinc-900 rounded-tr-sm"
            : "bg-zinc-700 text-zinc-100 rounded-tl-sm",
        )}
      >
        {message.content}
      </div>
    </div>
  );
}
