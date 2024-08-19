import { auth, convertSession } from "@/auth"
import { createSafeActionClient } from "next-safe-action"

export const actionClient = createSafeActionClient({})

export const authedAction = actionClient.use(async ({ next }) => {
  const session = await auth()

  if (!session) {
    throw new Error("Not authenticated")
  }

  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  return next({ ctx: { user: convertSession(session).user } })
})
