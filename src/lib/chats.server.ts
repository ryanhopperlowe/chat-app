"use server"

import { db } from "@/db"
import {
  Chat,
  chats,
  chatSchema,
  chatsToUsers,
  createChatSchema,
  createMessageSchema,
  Message,
  messages,
  messageSchema,
  User,
  users,
  userSchema,
} from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { authedAction } from "./safe-action"
import { pusherServer, pusherString } from "./pusher"

export const createChat = authedAction
  .schema(createChatSchema.extend({ userIds: z.number().array() }))
  .action(
    async ({ ctx, parsedInput }) =>
      await db.transaction(async (tx) => {
        const [chat] = await tx
          .insert(chats)
          .values({ name: parsedInput.name })
          .returning()

        await Promise.all(
          parsedInput.userIds
            .concat(ctx.user.id)
            .map((userId) =>
              tx.insert(chatsToUsers).values({ chatId: chat.id, userId })
            )
        )

        return { chat }
      })
  )

export type ChatWithUsers = Chat & {
  users: User[]
}

export const getChatsByAuthedUser = authedAction.action(
  async ({ ctx }): Promise<ChatWithUsers[]> => {
    const { user } = ctx

    const foundUser = await db.query.users.findFirst({
      where: eq(users.id, user.id),
      with: {
        chatsToUsers: {
          columns: {},
          with: {
            chat: {
              with: {
                chatsToUsers: {
                  columns: {},
                  with: { user: true },
                },
              },
            },
          },
        },
      },
    })

    if (!foundUser) {
      throw new Error("User not found")
    }

    return foundUser.chatsToUsers.map(
      ({ chat: { chatsToUsers, ...chat } }) => ({
        ...chatSchema.parse(chat),
        users: chatsToUsers.map(({ user }) => userSchema.parse(user)),
      })
    )
  }
)

export const getChatUsers = authedAction
  .schema(z.number())
  .action(async ({ ctx, parsedInput }): Promise<User[]> => {
    const { user } = ctx

    const foundChatUsers = await db.query.chatsToUsers.findMany({
      columns: {},
      where: eq(chatsToUsers.chatId, parsedInput),
      with: {
        user: true,
      },
    })

    if (!foundChatUsers) {
      throw new Error("Chat not found")
    }

    return foundChatUsers.map(({ user }) => userSchema.parse(user))
  })

export type ChatWithUsersAndMessages = ChatWithUsers & {
  messages: MessageWithUser[]
  users: User[]
}

export const getChatById = authedAction
  .schema(z.number())
  .action(async ({ ctx, parsedInput }): Promise<ChatWithUsersAndMessages> => {
    const { user } = ctx

    const foundChat = await db.query.chats.findFirst({
      where: eq(chats.id, parsedInput),
      with: {
        chatsToUsers: {
          columns: {},
          with: { user: true },
        },
        messages: { with: { user: true } },
      },
    })

    if (!foundChat) {
      throw new Error("Chat not found")
    }

    if (!foundChat.chatsToUsers.some(({ user: { id } }) => id === +user.id)) {
      throw new Error("User not in chat")
    }

    return {
      ...chatSchema.parse(foundChat),
      messages: foundChat.messages.map(({ user, ...message }) => ({
        ...messageSchema.parse(message),
        user: userSchema.parse(user),
      })),
      users: foundChat.chatsToUsers.map(({ user }) => userSchema.parse(user)),
    }
  })

export type MessageWithUser = Message & { user: User }

export const getChatMessages = authedAction
  .schema(z.number())
  .action(async ({ ctx, parsedInput }): Promise<MessageWithUser[]> => {
    const { user } = ctx

    const foundChat = await db.query.chats.findFirst({
      where: eq(chats.id, parsedInput),
      with: {
        chatsToUsers: { columns: { userId: true } },
        messages: {
          with: { user: true },
        },
      },
    })

    if (!foundChat) {
      throw new Error("Chat not found")
    }

    if (!foundChat.chatsToUsers.some(({ userId }) => userId === user.id)) {
      throw new Error("User not in chat")
    }

    return foundChat.messages.map(({ user, ...message }) => ({
      ...messageSchema.parse(message),
      user: userSchema.parse(user),
    }))
  })

export const createMessage = authedAction
  .schema(createMessageSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { user } = ctx

    const [message] = await db
      .insert(messages)
      .values({
        chatId: parsedInput.chatId,
        content: parsedInput.content,
        userId: user.id,
      })
      .returning()

    await pusherServer.trigger(
      pusherString(`chat:${parsedInput.chatId}`),
      "new-message",
      {
        message: {
          ...messageSchema.parse(message),
          user: userSchema.parse(user),
        } as MessageWithUser,
      }
    )
  })
