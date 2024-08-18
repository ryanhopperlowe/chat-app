"use client"

import { User } from "@/db/schema"
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react"
import { signOut } from "next-auth/react"
import { MyLink } from "./Link"

export function NavBar({ user }: { user: User }) {
  return (
    <Navbar className="w-full px-4">
      <NavbarBrand>
        <MyLink href="/">Chat App</MyLink>
      </NavbarBrand>

      <NavbarContent justify="end">
        <NavbarItem>{user.username}</NavbarItem>

        <NavbarItem>
          <MyLink href="/friends">Friends</MyLink>
        </NavbarItem>

        <NavbarItem>
          <MyLink href="/chats">Chats</MyLink>
        </NavbarItem>

        <NavbarItem>
          <Button onClick={() => signOut()}>Logout</Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}
