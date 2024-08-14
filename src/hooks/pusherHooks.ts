"use client"

import { MessageWithUser } from "@/lib/chats.server"
import { pusherClient, pusherString } from "@/lib/pusher"
import { useEffect, useState } from "react"

export function useNewChatMessages(chatId: number) {
  const [messages, setMessages] = useState<MessageWithUser[]>([])

  useEffect(() => {
    const channelString = pusherString(`chat:${chatId}`)
    const channel = pusherClient.subscribe(channelString)

    channel.bind("new-message", ({ message }: { message: MessageWithUser }) => {
      setMessages((messages) => [...messages, message])
    })

    return () => {
      channel.unbind("new-message")
      channel.unsubscribe()
    }
  }, [chatId])

  return messages
}
