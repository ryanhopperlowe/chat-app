"use client"

import { useNewChatMessages } from "@/hooks/pusherHooks"
import { ChatWithUsersAndMessages } from "@/lib/chats.server"
import { Avatar, Chip } from "@nextui-org/react"
import classNames from "classnames"
import { useMemo } from "react"
import { LetterIcon } from "./LetterIcon"

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
    <div className="flex-1 overflow-auto flex flex-col-reverse">
      <div className="flex flex-col gap-2 justify-end p-4">
        {messages.map((message) => {
          const isCurrentUser = userId === message.user.id

          return (
            <div
              key={message.id}
              className={classNames("flex gap-2 align-middle py-2", {
                "flex-row-reverse": isCurrentUser,
              })}
            >
              <Avatar
                icon={
                  <LetterIcon
                    size={20}
                    letter={message.user.username.charAt(0)}
                  />
                }
                className="min-w-fit"
                color={isCurrentUser ? "primary" : "secondary"}
              />

              <div
                className={classNames("w-full flex items-center", {
                  "justify-end": isCurrentUser,
                })}
              >
                <div className="flex flex-col">
                  <p className="bg-gray-100 rounded-xl break-all h-auto text-wrap flex justify-center py-2 px-4">
                    {message.content}
                  </p>
                  <p
                    className={classNames("text-xs text-gray-500", {
                      "text-right": isCurrentUser,
                    })}
                  >
                    {message.user.username}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
