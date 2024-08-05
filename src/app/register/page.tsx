import { fromFormData } from "@/lib/helpers"
import { registerUser } from "@/lib/users.server"
import { redirect } from "next/navigation"
import { Button, Form, Stack } from "react-bootstrap"

export default async function Register() {
  return (
    <main className="w-full h-full flex flex-col items-center justify-center p-20">
      <Stack gap={3}>
        <h4 className="text-lg font-bold">Register</h4>
        <Form
          className="flex flex-col gap-3"
          action={async (formData) => {
            "use server"
            await fromFormData(registerUser)(formData)
            redirect("/")
          }}
        >
          <Form.FloatingLabel label="Username" className="mb-3">
            <Form.Control type="text" placeholder="Username" name="username" />
          </Form.FloatingLabel>

          <Form.FloatingLabel label="Password">
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
            />
          </Form.FloatingLabel>

          <Button type="submit">Register</Button>
        </Form>
      </Stack>
    </main>
  )
}
