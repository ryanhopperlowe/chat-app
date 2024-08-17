import { createMessage } from "@/lib/chats.server"
import { Button, Input } from "@nextui-org/react"

export async function ChatMessageBar({
  chatId,
  userId,
}: {
  chatId: number
  userId: number
}) {
  return (
    <form
      className="flex gap-2 p-2"
      action={async (formData) => {
        "use server"

        const content = formData.get("content")

        if (!content) {
          return
        }

        await createMessage({
          chatId,
          userId,
          content: content as string,
        })
      }}
    >
      <Input
        type="text"
        placeholder="Message"
        className="flex-1"
        name="content"
      />

      <Button type="submit">Send</Button>

      <input type="hidden" name="chatId" value={chatId} />
      <input type="hidden" name="userId" value={userId} />
    </form>
  )
}
