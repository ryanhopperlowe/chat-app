"use client"

import { useUser } from "@/hooks/useAuth"
import { ChatWithUsers, removeUserFromChat } from "@/lib/chats.server"
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react"
import { useAction } from "next-safe-action/hooks"
import { LeaveChat } from "./LeaveChat"

export function ChatHeader({
  chat,
  userId,
}: {
  chat: ChatWithUsers
  userId: number
}) {
  const leaveChat = useAction(removeUserFromChat)

  return (
    <Navbar className="flex justify-between px-4" position="static">
      {chat.name ? <NavbarBrand>{chat.name}</NavbarBrand> : <div />}
      <NavbarContent className="flex gap-2" justify="start">
        <NavbarItem>Users:</NavbarItem>
        {chat.users
          .filter((user) => user.id !== userId)
          .map((user) => (
            <NavbarItem key={user.id}>{user.username}</NavbarItem>
          ))}
      </NavbarContent>

      <NavbarContent className="flex gap-2" justify="end">
        <NavbarItem>
          <LeaveChat chat={chat} userId={userId} />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}
