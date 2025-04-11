import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageItem } from "./message-item"
import type { Message } from "../types"

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return null
  }

  return (
    <ScrollArea className="h-[calc(100vh-13rem)] pr-4">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <MessageItem key={index} message={message} isLast={index === messages.length - 1} />
        ))}
      </div>
    </ScrollArea>
  )
}
