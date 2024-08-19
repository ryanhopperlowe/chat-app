"use server"

import { db } from "@/db"
import {
  friendRequests,
  friendRequestSchema,
  friends,
  registerSchema,
  userFilterSchema,
  UserQuery,
  users,
  userSchema,
} from "@/db/schema"
import { hash } from "bcryptjs"
import { and, eq, ilike, ne, not, or } from "drizzle-orm"
import { actionClient, authedAction } from "./safe-action"
import { revalidatePath } from "next/cache"
import { z } from "zod"

export const searchUsers = authedAction
  .schema(userFilterSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx

    const userRelatedFilters = [
      parsedInput?.username &&
        ilike(users.username, "%" + parsedInput.username + "%"),
      parsedInput?.id && eq(users.id, parsedInput.id),
      parsedInput?.hideSelf && ne(users.id, user.id),
    ].filter((x) => !!x)

    const foundUsers = await db.query.users.findMany({
      where: and(...userRelatedFilters),
      with: { friends: true, friendRequestsTo: true, friendRequestsFrom: true },
    })

    const parsedUsers: UserQuery[] = foundUsers.map((foundUser) => ({
      ...userSchema.parse(foundUser),
      isFriend: foundUser.friends.some(({ friendId }) => friendId === user.id),
      isRequested: foundUser.friendRequestsTo.some(
        ({ fromId }) => fromId === user.id
      ),
      hasRequested: foundUser.friendRequestsFrom.some(
        ({ toId }) => toId === user.id
      ),
    }))

    return parsedUsers.filter(({ isFriend, isRequested, hasRequested }) => {
      if (parsedInput?.isFriend != null && isFriend !== parsedInput.isFriend)
        return false

      if (
        parsedInput?.isRequested != null &&
        isRequested !== parsedInput.isRequested
      )
        return false

      if (
        parsedInput?.hasRequested != null &&
        hasRequested !== parsedInput.hasRequested
      )
        return false

      return true
    })
  })

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

export const requestFriendById = authedAction
  .schema(userSchema.shape.id)
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx

    const userToRequest = await db.query.users.findFirst({
      where: eq(users.id, parsedInput),
    })

    if (!userToRequest) {
      throw new Error("User not found")
    }

    await db.insert(friendRequests).values({
      fromId: user.id,
      toId: userToRequest.id,
    })

    revalidatePath("/friends")
  })

export const replyToFriendRequest = authedAction
  .schema(z.object({ id: friendRequestSchema.shape.id, accepted: z.boolean() }))
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx

    const { id, accepted } = parsedInput

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

    if (accepted) {
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
    }

    await db.delete(friendRequests).where(eq(friendRequests.id, id))

    revalidatePath("/friends")
  })

export const removeFriend = authedAction
  .schema(
    z.object({
      userId: userSchema.shape.id,
      friendId: userSchema.shape.id,
    })
  )
  .action(async ({ parsedInput: { userId, friendId }, ctx }) => {
    const { user } = ctx

    if (user.id !== userId) throw new Error("Unauthorized")

    const requestAb = and(
      eq(friends.userId, friendId),
      eq(friends.friendId, userId)
    )

    const requestBa = and(
      eq(friends.userId, userId),
      eq(friends.friendId, friendId)
    )

    await db.delete(friends).where(or(requestAb, requestBa))

    revalidatePath("/friends")
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
  .action(async ({ parsedInput: userId, ctx }) => {
    const { user } = ctx

    if (userId !== user.id) {
      throw new Error("Unauthorized")
    }

    const foundFriendRequests = await db.query.friendRequests.findMany({
      where: eq(friendRequests.toId, userId),
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
