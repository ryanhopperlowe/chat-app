import { Login } from "@/components/Login"
import { Button, Link } from "@nextui-org/react"

export default function LoginPage() {
  return (
    <main className="w-full h-full flex flex-col items-center justify-center">
      <div className="flex gap-3 m-20">
        <h4 className="text-lg font-bold">Login</h4>
        <Login />
        <Button as={Link} href="/register" color="secondary">
          Register
        </Button>
      </div>
    </main>
  )
}
