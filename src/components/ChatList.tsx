"use client"

import type { ChatWithUsers } from "@/lib/chats.server"
import { Listbox, ListboxItem } from "@nextui-org/react"
import { useParams, useRouter } from "next/navigation"
import { CreateChat } from "./CreateChat"

export const ChatList = ({
  chats,
  userId,
}: {
  chats: ChatWithUsers[]
  userId: number
}) => {
  const selectedChatId = useParams().id as string
  const router = useRouter()

  return (
    <>
      <CreateChat className="w-full" variant="solid" color="primary" />

      <Listbox
        label="Chats"
        selectionMode="single"
        selectedKeys={[selectedChatId].filter(Boolean)}
        onSelectionChange={(keys) => {
          const key = Array.from(keys).find(Boolean)
          return key && router.push(`/chats/${key}`)
        }}
      >
        {chats.map((chat) => {
          const chatName = getChatName(chat)
          return (
            <ListboxItem key={chat.id} textValue={chatName}>
              {chatName}
            </ListboxItem>
          )
        })}
      </Listbox>
    </>
  )

  function getChatName(chat: ChatWithUsers) {
    return (
      chat.name ||
      chat.users
        .filter(({ id }) => id !== userId)
        .map((user) => user.username)
        .join(", ")
    )
  }
}
