"use client"

import { MessageWithUser } from "@/lib/chats.server"
import { pusherClient, pusherString } from "@/lib/pusher"
import { useEffect, useState } from "react"

export function useNewChatMessages(chatId: number) {
  const [messages, setMessages] = useState<MessageWithUser[]>([])

  useEffect(() => {
    const chatChannel = pusherClient.channel(pusherString(`chat:${chatId}`))

    chatChannel.subscribe()

    chatChannel.bind(
      "new-message",
      ({ message }: { message: MessageWithUser }) => {
        setMessages((messages) => [...messages, message])
      }
    )

    return () => {
      chatChannel.unbind("new-message")
      chatChannel.unsubscribe()
    }
  }, [chatId])

  return messages
}
