"use server"

import { db } from "@/db"
import { users, User } from "@/db/schema"
import { and, eq, SQLWrapper } from "drizzle-orm"

type OptionalUserValues = {
  [key in keyof User]?: User[key] | null
}

export async function getUsers(query: OptionalUserValues) {
  const constraints: SQLWrapper[] = []

  if (query.username) {
    constraints.push(eq(users.username, query.username))
  }

  const found = await db.query.users.findMany({
    columns: { id: true, username: true },
    where: and(...constraints),
  })

  return found
}

export async function getUser(username: string) {
  const user = await db.query.users.findFirst({
    columns: { id: true, username: true },
    where: eq(users.username, username),
  })

  if (!user) {
    throw new Error("User not found")
  }

  return user
}
