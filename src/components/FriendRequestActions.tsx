"use client"

import { replyToFriendRequest } from "@/lib/users.server"
import { Button, Spinner } from "@nextui-org/react"
import { useAction } from "next-safe-action/hooks"

export function FriendRequestActions({ requestId }: { requestId: number }) {
  const acceptRequest = useAction(replyToFriendRequest)

  const handleReply = (accepted: boolean) =>
    acceptRequest.execute({ id: requestId, accepted })

  return (
    <div className="flex gap-2">
      {acceptRequest.isExecuting && <Spinner size="sm" color="primary" />}

      <Button
        color="primary"
        variant="flat"
        disabled={acceptRequest.isExecuting}
        onClick={() => handleReply(true)}
      >
        Accept
      </Button>

      <Button
        color="danger"
        variant="flat"
        disabled={acceptRequest.isExecuting}
        onClick={() => handleReply(false)}
      >
        Decline
      </Button>
    </div>
  )
}
