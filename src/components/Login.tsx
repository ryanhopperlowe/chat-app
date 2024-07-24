import { signIn } from "@/auth"
import { redirect } from "next/navigation"
import { Button } from "react-bootstrap"

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
      <Button className="w-full" type="submit" variant="primary">
        Sign in
      </Button>
    </form>
  )
}
