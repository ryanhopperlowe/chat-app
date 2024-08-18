"use server"

import { db } from "@/db"
import {
  friendRequests,
  friendRequestSchema,
  friends,
  friendSchema,
  registerSchema,
  users,
  userSchema,
} from "@/db/schema"
import { hash } from "bcryptjs"
import { and, eq, or } from "drizzle-orm"
import { z } from "zod"
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

export const requestFriendByUsername = authedAction
  .schema(z.object({ username: z.string() }))
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx

    const userToRequest = await db.query.users.findFirst({
      where: eq(users.username, parsedInput.username),
    })

    if (!userToRequest) {
      throw new Error("User not found")
    }

    const [friendRequest] = await db
      .insert(friendRequests)
      .values({
        fromId: user.id,
        toId: userToRequest.id,
      })
      .returning()

    return friendRequestSchema.parse(friendRequest)
  })

export const acceptFriendRequest = authedAction
  .schema(friendRequestSchema.shape.id)
  .action(async ({ parsedInput: id, ctx }) => {
    const { user } = ctx

    const request = await db.query.friendRequests.findFirst({
      where: eq(friendRequests.id, id),
    })

    if (!request) {
      throw new Error("Friend request not found")
    }

    if (request.toId !== user.id) {
      throw new Error("Unauthorized")
    }

    const friendId = request.fromId

    const isAlreadyFriend = await db.query.friends.findFirst({
      where: and(eq(friends.userId, user.id), eq(friends.friendId, friendId)),
    })

    if (!!isAlreadyFriend) {
      throw new Error("Friend request already accepted")
    }

    await db.insert(friends).values([
      { userId: user.id, friendId: friendId },
      { userId: friendId, friendId: user.id },
    ])

    await db.delete(friendRequests).where(eq(friendRequests.id, id))
  })

export const removeFriend = authedAction
  .schema(userSchema.shape.id)
  .action(async ({ parsedInput: friendId, ctx }) => {
    const { user } = ctx

    const requestAb = and(
      eq(friends.userId, friendId),
      eq(friends.friendId, user.id)
    )

    const requestBa = and(
      eq(friends.userId, user.id),
      eq(friends.friendId, friendId)
    )

    await db.delete(friends).where(or(requestAb, requestBa))
  })

export const getFriendsByUserId = authedAction
  .schema(userSchema.shape.id)
  .action(async ({ parsedInput: id }) => {
    const foundFriends = await db.query.friends.findMany({
      where: eq(friends.userId, id),
      with: {
        friend: true,
      },
    })

    return foundFriends.map(({ friend }) => userSchema.parse(friend))
  })

export const getReceivedFriendRequestsByUserId = authedAction
  .schema(userSchema.shape.id)
  .action(async ({ parsedInput: id, ctx }) => {
    const { user } = ctx

    if (id === user.id) {
      throw new Error("Unauthorized")
    }

    const foundFriendRequests = await db.query.friendRequests.findMany({
      where: eq(friendRequests.toId, id),
      with: { from: true },
    })

    return foundFriendRequests.map(({ from, ...request }) => ({
      ...friendRequestSchema.parse(request),
      from: userSchema.parse(from),
    }))
  })

export const getSentFriendRequestsByUserId = authedAction
  .schema(userSchema.shape.id)
  .action(async ({ parsedInput: id, ctx }) => {
    const { user } = ctx

    if (id === user.id) {
      throw new Error("Unauthorized")
    }

    const foundFriendRequests = await db.query.friendRequests.findMany({
      where: eq(friendRequests.fromId, id),
      with: { to: true },
    })

    return foundFriendRequests.map(({ to, ...request }) => ({
      ...friendRequestSchema.parse(request),
      to: userSchema.parse(to),
    }))
  })
