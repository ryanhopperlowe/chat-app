"use client"

import { User, userSchema } from "@/db/schema"
import { createChat } from "@/lib/chats.server"
import { getUserByUsername } from "@/lib/users.server"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Button,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  useDisclosure,
} from "@nextui-org/react"
import { signOut } from "next-auth/react"
import { useAction } from "next-safe-action/hooks"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

const schema = z.object({ users: userSchema.array(), name: z.string() })
type FormData = z.infer<typeof schema>

export function NavBar({ user }: { user: User }) {
  const modal = useDisclosure()
  const [username, setUsername] = useState("")
  const router = useRouter()

  const getUser = useAction(getUserByUsername)
  const createNewChat = useAction(createChat)

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
    <Navbar className="w-full px-4">
      <NavbarBrand as={Link} href="/">
        Chat App
      </NavbarBrand>

      <NavbarContent justify="end">
        <NavbarItem>{user.username}</NavbarItem>
        <NavbarItem
          as={Link}
          href="#"
          onClick={modal.onOpen}
          content="something"
        >
          New Chat
        </NavbarItem>
        <NavbarItem as={Link} href="" onClick={() => signOut()}>
          Logout
        </NavbarItem>
      </NavbarContent>

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
    </Navbar>
  )
}
