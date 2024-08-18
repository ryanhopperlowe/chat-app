"use client"

import { userSchema } from "@/db/schema"
import { createChat } from "@/lib/chats.server"
import { getUserByUsername } from "@/lib/users.server"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  ModalFooter,
  useDisclosure,
  Link,
  Input,
} from "@nextui-org/react"
import { useAction } from "next-safe-action/hooks"
import { useRouter } from "next/navigation"
import { ComponentProps, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"

const schema = z.object({ users: userSchema.array(), name: z.string() })
type FormData = z.infer<typeof schema>

export function CreateChat(props: Partial<ComponentProps<typeof Button>>) {
  const modal = useDisclosure()
  const getUser = useAction(getUserByUsername)
  const createNewChat = useAction(createChat)
  const [username, setUsername] = useState("")
  const router = useRouter()

  const form = useForm<FormData>({ resolver: zodResolver(schema) })
  const usersField = useFieldArray({ control: form.control, name: "users" })

  const onAddUser = async () => {
    if (usersField.fields.values().some((user) => user.username === username)) {
      alert("Username already added")
      return
    }

    const { data: user } = (await getUser.executeAsync(username)) || {}

    if (!user) {
      alert("User not found")
      return
    }

    usersField.append(user)
    setUsername("")
  }

  const handleSubmit = form.handleSubmit(async (data) => {
    await createNewChat.executeAsync({
      name: data.name || null,
      userIds: data.users.map((user) => user.id),
    })

    modal.onClose()
    router.push("/")
  })

  return (
    <>
      <Button onClick={modal.onOpen} {...props}>
        New Chat
      </Button>

      <Modal isOpen={modal.isOpen} onOpenChange={modal.onOpenChange}>
        <ModalContent>
          <ModalHeader>Create a new chat</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <form
                className="flex flex-col gap-2"
                onSubmit={handleSubmit}
                id="new-chat-form"
              >
                <Input placeholder="Chat Name" {...form.register("name")} />

                <div className="flex gap-2">
                  <Input
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                  />

                  <Button color="primary" onClick={onAddUser}>
                    Add
                  </Button>
                </div>
              </form>

              <p>Users</p>
              {usersField.fields.map((field, index) => (
                <div
                  className="flex align-middle justify-between"
                  key={field.username}
                >
                  {field.username}

                  <Button
                    color="danger"
                    onClick={() => usersField.remove(index)}
                  >
                    X
                  </Button>
                </div>
              ))}
            </div>
          </ModalBody>

          <ModalFooter>
            <Button color="secondary" onClick={modal.onClose}>
              Cancel
            </Button>

            <Button color="primary" type="submit" form="new-chat-form">
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
