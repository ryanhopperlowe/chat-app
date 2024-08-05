"use client"

import type { ChatWithUsers } from "@/lib/chats.server"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ListGroup } from "react-bootstrap"

export const ChatList = ({
  chats,
  userId,
}: {
  chats: ChatWithUsers[]
  userId: number
}) => {
  const selectedChatId = +useParams().id

  return (
    <ListGroup className="h-full flex flex-col">
      {chats.map((chat) => (
        <Link key={chat.id} href={`/chats/${chat.id}`}>
          <ListGroup.Item action active={chat.id == selectedChatId}>
            {chat.name ||
              chat.users
                .filter(({ id }) => userId != id)
                .map((user) => user.username)
                .join(", ")}
          </ListGroup.Item>
        </Link>
      ))}
      <ListGroup.Item className="flex-1" />
    </ListGroup>
  )
}
