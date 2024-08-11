import { getServerUser } from "@/auth"
import { ChatContent } from "@/components/ChatContent"
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

  return <ChatContent chat={chat} user={user} />
}
