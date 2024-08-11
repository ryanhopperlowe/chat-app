"use client"

import { useNewChatMessages } from "@/hooks/pusherHooks"
import { ChatWithUsersAndMessages } from "@/lib/chats.server"
import classNames from "classnames"
import { useMemo } from "react"

export function ChatMessages({
  chat,
  userId,
}: {
  chat: ChatWithUsersAndMessages
  userId: number
}) {
  const newMessages = useNewChatMessages(chat.id)

  const messages = useMemo(() => {
    return [...chat.messages, ...newMessages]
  }, [chat.messages, newMessages])

  return (
    <div className="flex-1 flex flex-col gap-2 justify-end p-4 overflow-y-auto">
      {messages.map((message) => (
        <div
          key={message.id}
          className={classNames("flex gap-2", {
            "flex-row-reverse": message.user.id === userId,
          })}
        >
          <div className="align-text-middle">{message.user.username}</div>
          <div className="rounded-full bg-gray-200 p-2 min-w-10">
            {message.content}
          </div>
        </div>
      ))}
    </div>
  )
}
