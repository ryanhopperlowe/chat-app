"use client"

import { removeFriend } from "@/lib/users.server"
import { Button } from "@nextui-org/react"
import { useAction } from "next-safe-action/hooks"

export function RemoveFriend({
  userId,
  friendId,
}: {
  userId: number
  friendId: number
}) {
  const remove = useAction(removeFriend)

  return (
    <Button
      color="danger"
      variant="flat"
      onClick={() => remove.execute({ userId, friendId })}
    >
      Remove
    </Button>
  )
}
