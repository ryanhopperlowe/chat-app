import { relations } from "drizzle-orm"
import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
})

export const userRelations = relations(users, ({ many }) => ({
  chatsToUsers: many(chatsToUsers),
  messages: many(messages),
  friends: many(friends, { relationName: "friend" }),
  friendRequestsFrom: many(friendRequests, {
    relationName: "friendRequestFrom",
  }),
  friendRequestsTo: many(friendRequests, { relationName: "friendRequestTo" }),
}))

export type User = Omit<typeof users.$inferSelect, "passwordHash">
export type NewUser = typeof users.$inferInsert
export const createUserSchema = createInsertSchema(users).omit({ id: true })
export const registerSchema = createUserSchema
  .omit({ passwordHash: true })
  .extend({ password: z.string() })
export const userSchema = createSelectSchema(users).omit({ passwordHash: true })

export const userQuerySchema = userSchema.extend({
  isFriend: z.boolean(),
  isRequested: z.boolean(),
  hasRequested: z.boolean(),
})
export const userFilterSchema = userQuerySchema
  .extend({ hideSelf: z.boolean() })
  .partial()

export type UserQuery = z.infer<typeof userQuerySchema>
export type UserFilter = z.infer<typeof userFilterSchema>

export const friends = pgTable(
  "friends",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    friendId: integer("friend_id")
      .notNull()
      .references(() => users.id),
  },
  (table) => ({
    unique: uniqueIndex("unique_friends").on(table.userId, table.friendId),
  })
)

export const friendRelations = relations(friends, ({ one }) => ({
  user: one(users, {
    fields: [friends.userId],
    references: [users.id],
    relationName: "friend",
  }),
  friend: one(users, {
    fields: [friends.friendId],
    references: [users.id],
    relationName: "friendOf",
  }),
}))

export type Friend = typeof friends.$inferSelect
export type NewFriend = typeof friends.$inferInsert
export const friendSchema = createSelectSchema(friends)
export const createFriendSchema = createInsertSchema(friends).omit({ id: true })

export const friendRequests = pgTable(
  "friend_requests",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    fromId: integer("from_id")
      .notNull()
      .references(() => users.id),
    toId: integer("to_id")
      .notNull()
      .references(() => users.id),
  },
  (table) => ({
    unique: uniqueIndex("unique_friend_requests").on(table.fromId, table.toId),
  })
)

export const friendRequestRelations = relations(friendRequests, ({ one }) => ({
  from: one(users, {
    fields: [friendRequests.fromId],
    references: [users.id],
    relationName: "friendRequestFrom",
  }),
  to: one(users, {
    fields: [friendRequests.toId],
    references: [users.id],
    relationName: "friendRequestTo",
  }),
}))

export type FriendRequest = typeof friendRequests.$inferSelect
export type NewFriendRequest = typeof friendRequests.$inferInsert
export const friendRequestSchema = createSelectSchema(friendRequests)
export const createFriendRequestSchema = createInsertSchema(
  friendRequests
).omit({ id: true })

export const messages = pgTable("messages", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  chatId: integer("chat_id")
    .notNull()
    .references(() => chats.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})

export const messageRelations = relations(messages, ({ one }) => ({
  user: one(users, { fields: [messages.userId], references: [users.id] }),
  chat: one(chats, { fields: [messages.chatId], references: [chats.id] }),
}))

export type Message = typeof messages.$inferSelect
export type NewMessage = typeof messages.$inferInsert
export const messageSchema = createSelectSchema(messages)
export const createMessageSchema = createInsertSchema(messages).omit({
  id: true,
})

export const chats = pgTable("chats", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name"),
})

export const chatRelations = relations(chats, ({ many }) => ({
  messages: many(messages),
  chatsToUsers: many(chatsToUsers),
}))

export type Chat = typeof chats.$inferSelect
export type NewChat = typeof chats.$inferInsert
export const createChatSchema = createInsertSchema(chats).omit({ id: true })
export const chatSchema = createSelectSchema(chats)

export const chatsToUsers = pgTable(
  "chats_to_users",
  {
    chatId: integer("chat_id")
      .notNull()
      .references(() => chats.id),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
  },
  (table) => ({ pk: primaryKey({ columns: [table.chatId, table.userId] }) })
)

export const chatsToUsersRelations = relations(chatsToUsers, ({ one }) => ({
  chat: one(chats, { fields: [chatsToUsers.chatId], references: [chats.id] }),
  user: one(users, { fields: [chatsToUsers.userId], references: [users.id] }),
}))
