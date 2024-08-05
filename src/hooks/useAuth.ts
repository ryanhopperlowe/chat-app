import { useSession } from "next-auth/react"

export function useUser() {
  const session = useSession()

  if (!session.data) {
    throw new Error("Not authenticated")
  }

  return session.data.user
}
