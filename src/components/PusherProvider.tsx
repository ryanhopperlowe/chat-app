"use client"

import { usePusherStore } from "@/lib/pusher.client"
import { useEffect } from "react"

export function PusherProvider({ children }: { children: React.ReactNode }) {
  const { pusherClient, initPusherClient } = usePusherStore()

  useEffect(() => {
    initPusherClient()
  }, [initPusherClient])

  return pusherClient ? <>{children}</> : null
}
