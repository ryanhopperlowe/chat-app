import { createMessage } from "@/lib/chats.server"
import { Button, Form, FormControl } from "react-bootstrap"

export async function ChatMessageBar({
  chatId,
  userId,
}: {
  chatId: number
  userId: number
}) {
  return (
    <Form
      className="flex gap-2 px-2"
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
      <FormControl
        type="text"
        placeholder="Message"
        className="flex-1"
        name="content"
      />
      <Button type="submit">Send</Button>

      <input type="hidden" name="chatId" value={chatId} />
      <input type="hidden" name="userId" value={userId} />
    </Form>
  )
}
