"use client"

import { ChatWithUsers } from "@/lib/chats.server"
import { Nav, Navbar } from "react-bootstrap"

export function ChatHeader({
  chat,
  userId,
}: {
  chat: ChatWithUsers
  userId: number
}) {
  return (
    <Navbar className="flex justify-between px-4 border border-black">
      {chat.name ? <Navbar.Brand>{chat.name}</Navbar.Brand> : <div />}
      <Navbar.Collapse className="justify-end">
        <Nav className="flex gap-2">
          <Nav.Item>Users: </Nav.Item>
          {chat.users
            .filter((user) => user.id !== userId)
            .map((user) => (
              <Nav.Item key={user.id}>{user.username}</Nav.Item>
            ))}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}
