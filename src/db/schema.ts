import { integer, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
})

export type User = Omit<typeof users.$inferSelect, "passwordHash">
export type NewUser = typeof users.$inferInsert

export const messages = pgTable("messages", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  chatId: integer("chat_id")
    .notNull()
    .references(() => users.id),
  content: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})

export type Message = typeof messages.$inferSelect
export type NewMessage = typeof messages.$inferInsert

export const chats = pgTable("chats", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
})

export type Chat = typeof chats.$inferSelect
export type NewChat = typeof chats.$inferInsert

export const chatUsers = pgTable(
  "chat_users",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    chatId: integer("chat_id")
      .notNull()
      .references(() => chats.id),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
  },
  (table) => ({
    chad: unique().on(table.chatId, table.userId),
  })
)
