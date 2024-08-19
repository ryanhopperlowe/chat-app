"use client"

import { requestFriendById } from "@/lib/users.server"
import { Button, Spinner } from "@nextui-org/react"
import { useAction } from "next-safe-action/hooks"

export default function AddFriend({ friendId }: { friendId: number }) {
  const requestFriend = useAction(requestFriendById)

  return (
    <Button
      color="primary"
      variant="flat"
      onClick={() => requestFriend.execute(friendId)}
    >
      Add Friend{" "}
      {requestFriend.isExecuting && <Spinner size="sm" color="white" />}
    </Button>
  )
}
