"use server"

import { db } from "@/db"
import { chats, NewChat } from "@/db/schema"

export async function createChat(newChat: NewChat) {
  const res = await db.insert(chats).values(newChat)

  if (!res.rowCount) {
    throw new Error("Error creating chat")
  }
}
