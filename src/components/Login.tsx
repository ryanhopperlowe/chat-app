import { signIn } from "@/auth"
import { redirect } from "next/navigation"
import { Button } from "@nextui-org/react"

export function Login() {
  return (
    <form
      className="w-full flex flex-col"
      action={async () => {
        "use server"
        await signIn(undefined, { redirectTo: "/" })
        redirect("/")
      }}
    >
      <Button className="w-full" type="submit" color="primary">
        Sign in
      </Button>
    </form>
  )
}
