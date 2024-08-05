import { auth, getServerUser } from "@/auth"
import { ChatList } from "@/components/ChatList"
import { getChatsByAuthedUser } from "@/lib/chats.server"

export default async function ChatsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const chatResponse = await getChatsByAuthedUser()
  const { user } = await getServerUser()

  if (!chatResponse?.data) {
    return <div>Error</div>
  }

  const chats = chatResponse.data

  return (
    <main className="py-2 flex flex-1">
      <div className="w-40 h-full">
        <ChatList chats={chats} userId={user.id} />
      </div>

      <div className="flex-1">{children}</div>
    </main>
  )
}
