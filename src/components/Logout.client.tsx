"use client"

import { signOut } from "next-auth/react"
import { Button } from "react-bootstrap"

export function Logout() {
  return <Button onClick={() => signOut()}>Logout</Button>
}
