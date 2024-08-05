"use client"

import { User, userSchema } from "@/db/schema"
import { createChat } from "@/lib/chats.server"
import { getUserByUsername } from "@/lib/users.server"
import { zodResolver } from "@hookform/resolvers/zod"
import { signOut } from "next-auth/react"
import { useAction } from "next-safe-action/hooks"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button, Form, Modal, Nav, Navbar } from "react-bootstrap"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

const schema = z.object({ users: userSchema.array(), name: z.string() })
type FormData = z.infer<typeof schema>

export function NavBar({ user }: { user: User }) {
  const [show, setShow] = useState(false)
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

    setShow(false)
    router.push("/")
  })

  return (
    <Navbar className="w-full px-4">
      <Navbar.Brand href="/">Chat App</Navbar.Brand>

      <Navbar.Collapse className="flex justify-end">
        <Nav>
          <Nav.Link>{user.username}</Nav.Link>
          <Nav.Link onClick={() => setShow(true)}>New Chat</Nav.Link>
          <Nav.Link onClick={() => signOut()}>Logout</Nav.Link>
        </Nav>
      </Navbar.Collapse>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create a new chat</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="flex flex-col gap-4">
            <Form
              className="flex flex-col gap-2"
              onSubmit={handleSubmit}
              id="new-chat-form"
            >
              <Form.FloatingLabel label="Chat Name" className="flex-1">
                <Form.Control
                  type="text"
                  placeholder="Chat Name"
                  {...form.register("name")}
                />
              </Form.FloatingLabel>

              <div className="flex gap-2">
                <Form.FloatingLabel label="Username" className="flex-1">
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.FloatingLabel>

                <Button variant="primary" onClick={onAddUser}>
                  Add
                </Button>
              </div>
            </Form>

            <p>Users</p>
            {usersField.fields.map((field, index) => (
              <div
                className="flex align-middle justify-between"
                key={field.username}
              >
                {field.username}

                <Button
                  variant="danger"
                  onClick={() => usersField.remove(index)}
                >
                  X
                </Button>
              </div>
            ))}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>

          <Button variant="primary" type="submit" form="new-chat-form">
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </Navbar>
  )
}
