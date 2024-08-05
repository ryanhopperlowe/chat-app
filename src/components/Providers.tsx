"use client"
import { SessionProvider } from "next-auth/react"
import { SSRProvider } from "react-bootstrap"

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
