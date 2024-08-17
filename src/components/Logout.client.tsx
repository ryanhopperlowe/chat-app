"use client"

import { signOut } from "next-auth/react"
import { Button } from "@nextui-org/react"

export function Logout() {
  return <Button onClick={() => signOut()}>Logout</Button>
}
