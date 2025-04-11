import { Avatar } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Bot, User } from "lucide-react"
import ReactMarkdown from "react-markdown"
import type { Message } from "../types"

interface MessageItemProps {
  message: Message
  isLast: boolean
}

export function MessageItem({ message, isLast }: MessageItemProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex w-full items-start gap-4 py-4", !isLast && "border-b border-border")}>
      <Avatar className={cn("mt-0.5 h-8 w-8", isUser ? "bg-primary" : "bg-muted")}>
        <div className="flex h-full items-center justify-center">
          {isUser ? <User className="h-4 w-4 text-primary-foreground" /> : <Bot className="h-4 w-4 text-foreground" />}
        </div>
      </Avatar>
      <div className="flex-1 space-y-2">
        <div className="font-semibold">{isUser ? "Vous" : "Assistant IA"}</div>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
