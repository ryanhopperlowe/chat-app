"use client"

import type { ChatWithUsers } from "@/lib/chats.server"
import { Listbox, ListboxItem } from "@nextui-org/react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

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
    <Listbox
      label="Chats"
      selectionMode="single"
      selectedKeys={[selectedChatId].filter(Boolean)}
      onSelectionChange={(keys) => {
        const key = Array.from(keys).find(Boolean)
        return key && router.push(`/chats/${key}`)
      }}
      selectionBehavior="replace"
    >
      {chats.map((chat) => {
        const chatName =
          chat.name ||
          chat.users
            .filter(({ id }) => userId != id)
            .map((user) => user.username)
            .join(", ")

        return (
          <ListboxItem key={chat.id} textValue={chatName}>
            {chatName}
          </ListboxItem>
        )
      })}
    </Listbox>
  )
}
