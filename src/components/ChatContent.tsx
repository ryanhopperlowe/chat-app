import { User } from "@/db/schema"
import { ChatWithUsersAndMessages } from "@/lib/chats.server"
import { ChatHeader } from "./ChatHeader"
import { ChatMessageBar } from "./ChatMessageBar"
import { ChatMessages } from "./ChatMessages"

export function ChatContent({
  chat,
  user,
}: {
  chat: ChatWithUsersAndMessages
  user: User
}) {
  return (
    <div className="w-full flex-1 flex flex-col overflow-auto">
      <ChatHeader chat={chat} userId={+user.id} />
      <ChatMessages chat={chat} userId={user.id} />
      <ChatMessageBar chatId={chat.id} userId={user.id} />
    </div>
  )
}
