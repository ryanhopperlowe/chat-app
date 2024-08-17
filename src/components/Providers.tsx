"use client"

import { NextUIProvider } from "@nextui-org/react"
import { SessionProvider } from "next-auth/react"
import { useRouter } from "next/navigation"
import { PusherProvider } from "./PusherProvider"

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <PusherProvider>
      <NextUIProvider navigate={router.push}>
        <SessionProvider>{children}</SessionProvider>
      </NextUIProvider>
    </PusherProvider>
  )
}
