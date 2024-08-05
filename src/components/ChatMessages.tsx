import { MessageWithUser } from "@/lib/chats.server"
import classNames from "classnames"

export function ChatMessages({
  messages,
  userId,
}: {
  messages: MessageWithUser[]
  userId: number
}) {
  return (
    <div className="flex-1 flex flex-col gap-2 justify-end p-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={classNames("flex gap-2", {
            "flex-row-reverse": message.user.id === userId,
          })}
        >
          <div className="align-text-middle">{message.user.username}</div>
          <div className="rounded-full bg-gray-200 p-2 min-w-10">
            {message.content}
          </div>
        </div>
      ))}
    </div>
  )
}
