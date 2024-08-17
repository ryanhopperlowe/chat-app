import { fromFormData } from "@/lib/helpers"
import { registerUser } from "@/lib/users.server"
import { Button, Input } from "@nextui-org/react"
import { redirect } from "next/navigation"

export default async function Register() {
  return (
    <main className="w-full h-full flex flex-col items-center justify-center p-20">
      <div className="flex flex-col gap-3 flex-1 w-full">
        <h4 className="text-lg font-bold">Register</h4>
        <form
          className="flex flex-col gap-3 flex-1 w-full"
          action={async (formData) => {
            "use server"
            await fromFormData(registerUser)(formData)
            redirect("/")
          }}
        >
          <Input
            type="text"
            placeholder="Username"
            name="username"
            className="mb-3"
          />

          <Input
            type="password"
            placeholder="Password"
            name="password"
            className="mb-3"
          />

          <Button type="submit" color="primary">
            Register
          </Button>
        </form>
      </div>
    </main>
  )
}
