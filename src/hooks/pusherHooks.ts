"use client"

import { MessageWithUser } from "@/lib/chats.server"
import { usePusherStore } from "@/lib/pusher.client"
import { pusherString } from "@/lib/pusher.server"
import { useEffect, useState } from "react"

export function useNewChatMessages(chatId: number) {
  const [messages, setMessages] = useState<MessageWithUser[]>([])

  const { pusherClient } = usePusherStore()

  useEffect(() => {
    if (!pusherClient) return

    const channelString = pusherString(`chat:${chatId}`)
    const channel = pusherClient.subscribe(channelString)

    channel.bind("new-message", ({ message }: { message: MessageWithUser }) => {
      setMessages((messages) => [...messages, message])
    })

    return () => {
      channel.unbind("new-message")
    }
  }, [chatId, pusherClient])

  return messages
}
