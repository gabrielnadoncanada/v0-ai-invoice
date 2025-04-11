"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SendIcon, Loader2 } from "lucide-react"
import { useRef, useState } from "react"

interface MessageInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
  placeholder?: string
}

export function MessageInput({ onSendMessage, isLoading, placeholder = "Posez une question..." }: MessageInputProps) {
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSendMessage(input)
      setInput("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="min-h-12 resize-none pr-12"
        disabled={isLoading}
      />
      <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="absolute bottom-1.5 right-1.5">
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendIcon className="h-4 w-4" />}
      </Button>
    </form>
  )
}
