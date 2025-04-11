"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"
import { useAIAssistant } from "../hooks/use-ai-assistant"
import { MessageList } from "./message-list"
import { MessageInput } from "./message-input"
import { EmptyState } from "./empty-state"
import { SuggestionsList } from "./suggestions-list"

export function AIAssistant() {
  const { messages, isLoading, sendMessage, resetConversation, suggestions } = useAIAssistant()

  const hasMessages = messages.length > 0

  return (
    <Card className="h-[calc(100vh-6rem)]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Assistant IA</CardTitle>
        {hasMessages && (
          <Button variant="outline" size="icon" onClick={resetConversation} title="Nouvelle conversation">
            <RefreshCcw className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex h-[calc(100%-4rem)] flex-col justify-between space-y-4">
        {hasMessages ? (
          <MessageList messages={messages} />
        ) : (
          <>
            <EmptyState />
            <SuggestionsList suggestions={suggestions} onSelectSuggestion={sendMessage} isLoading={isLoading} />
          </>
        )}

        <div className="pt-4">
          <MessageInput onSendMessage={sendMessage} isLoading={isLoading} />
        </div>
      </CardContent>
    </Card>
  )
}
