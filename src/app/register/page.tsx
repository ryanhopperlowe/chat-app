"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button, Form, Stack } from "react-bootstrap"

export default function Register() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const register = async () => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })

    if (res.ok) {
      router.push("api/auth/signin")
    } else {
      alert("Something went wrong")
    }
  }

  return (
    <main className="w-full h-full flex flex-col items-center justify-center p-20">
      <Stack gap={3}>
        <h4 className="text-lg font-bold">Register</h4>
        <Form as={Stack} gap={3}>
          <Form.FloatingLabel label="Username" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.FloatingLabel>

          <Form.FloatingLabel label="Password">
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.FloatingLabel>

          <Button type="submit" onClick={register}>
            Register
          </Button>
        </Form>
      </Stack>
    </main>
  )
}
