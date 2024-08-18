"use client"

import { Listbox, ListboxItem } from "@nextui-org/react"
import { usePathname } from "next/navigation"
import Link from "next/link"

const items = [
  { label: "My Friends", href: "/friends" },
  { label: "Friend Requests", href: "/friends/friend-requests" },
  { label: "Find Friends", href: "/friends/find-friends" },
]

export function FriendsNav() {
  const pathname = usePathname()

  return (
    <Listbox
      label="Friends Menu"
      selectionMode="single"
      selectedKeys={[pathname]}
      selectionBehavior="toggle"
      items={items}
    >
      {(item) => (
        <ListboxItem as={Link} href={item.href} key={item.href}>
          {item.label}
        </ListboxItem>
      )}
    </Listbox>
  )
}
