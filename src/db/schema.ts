import { relations } from "drizzle-orm"
import {
  integer,
  pgTable,
  text,
  timestamp,
  primaryKey,
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
}))

export type User = Omit<typeof users.$inferSelect, "passwordHash">
export type NewUser = typeof users.$inferInsert
export const createUserSchema = createInsertSchema(users).omit({ id: true })
export const registerSchema = createUserSchema
  .omit({ passwordHash: true })
  .extend({ password: z.string() })
export const userSchema = createSelectSchema(users).omit({ passwordHash: true })

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
