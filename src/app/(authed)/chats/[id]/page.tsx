import { auth, getServerUser } from "@/auth"
import { ChatHeader } from "@/components/ChatHeader"
import { ChatMessageBar } from "@/components/ChatMessageBar"
import { ChatMessages } from "@/components/ChatMessages"
import { getChatById } from "@/lib/chats.server"

export default async function ChatPage({ params }: { params: { id: string } }) {
  const { id } = params

  const chatReq = await getChatById(+id)
  const { user } = await getServerUser()

  if (!chatReq?.data) {
    return <h1>Chat not found</h1>
  }

  if (!user) {
    return <h1>Not authenticated</h1>
  }

  const { data: chat } = chatReq

  console.log(user, chat)

  return (
    <div className="h-full w-full flex flex-col">
      <ChatHeader chat={chat} userId={+user.id} />
      <ChatMessages messages={chat.messages} userId={user.id} />
      <ChatMessageBar chatId={chat.id} userId={user.id} />
    </div>
  )
}
