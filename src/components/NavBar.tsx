"use client"

import { User } from "@/db/schema"
import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react"
import { signOut } from "next-auth/react"
import { CreateChat } from "./CreateChat"

export function NavBar({ user }: { user: User }) {
  return (
    <Navbar className="w-full px-4">
      <NavbarBrand as={Link} href="/">
        Chat App
      </NavbarBrand>

      <NavbarContent justify="end">
        <NavbarItem>{user.username}</NavbarItem>

        <NavbarItem>
          <CreateChat />
        </NavbarItem>

        <NavbarItem as={Link} href="" onClick={() => signOut()}>
          Logout
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}
