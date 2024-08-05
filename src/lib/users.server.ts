"use server"

import { db } from "@/db"
import { registerSchema, users, userSchema } from "@/db/schema"
import { hash } from "bcryptjs"
import { eq } from "drizzle-orm"
import { actionClient, authedAction } from "./safe-action"

export const registerUser = actionClient
  .schema(registerSchema)
  .action(async ({ parsedInput }) => {
    const { password, ...user } = parsedInput
    const passwordHash = await hash(password, 10)

    const inserted = await db.insert(users).values({
      ...user,
      passwordHash,
    })

    return userSchema.parse(inserted)
  })

export const getUserByUsername = authedAction
  .schema(userSchema.shape.username)
  .action(async ({ parsedInput }) => {
    const user = await db.query.users.findFirst({
      where: eq(users.username, parsedInput),
    })

    if (!user) {
      throw new Error("User not found")
    }

    return userSchema.parse(user)
  })
