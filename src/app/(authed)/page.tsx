import { redirect } from "next/navigation"

export default function AuthedChats() {
  redirect("/chats")
}
