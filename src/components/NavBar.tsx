"use client"

import { Button, Form, Modal, Nav, Navbar } from "react-bootstrap"
import { signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { User } from "@/db/schema"
import { useFetch } from "@/hooks/useAsync"

const schema = z.object({ username: z.string().min(3) })
type FormData = z.infer<typeof schema>

export function NavBar() {
  const [show, setShow] = useState(false)

  const [usernames, setUserNames] = useState<string[]>([])
  const addUsername = (userId: string) =>
    setUserNames((prev) => [...prev, userId])
  const removeUsername = (userId: string) =>
    setUserNames((prev) => prev.filter((id) => id !== userId))

  const getUsers = useFetch<User[], { username: string }>("/api/users")

  const form = useForm<FormData>({ resolver: zodResolver(schema) })
  const handleSubmit = form.handleSubmit(async (data) => {
    if (usernames.includes(data.username)) {
      alert("Username already added")
      return
    }

    const users = await getUsers.execute({ username: data.username })

    if (users.length === 0) {
      alert("User not found")
      return
    }

    addUsername(data.username)
  })

  return (
    <Navbar className="w-full px-4">
      <Navbar.Brand href="/">Chat App</Navbar.Brand>

      <Navbar.Collapse className="flex justify-end">
        <Nav>
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
            <Form className="w-full flex gap-2" onSubmit={handleSubmit}>
              <Form.FloatingLabel label="Username" className="flex-1">
                <Form.Control
                  type="text"
                  placeholder="Username"
                  {...form.register("username")}
                />
              </Form.FloatingLabel>

              <Button variant="primary" type="submit">
                Add
              </Button>
            </Form>

            <p>Users</p>
            {usernames.map((username) => (
              <div className="flex align-middle justify-between" key={username}>
                {username}

                <Button
                  variant="danger"
                  onClick={() => removeUsername(username)}
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

          <Button variant="primary">Create</Button>
        </Modal.Footer>
      </Modal>
    </Navbar>
  )
}
