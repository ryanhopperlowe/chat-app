import { Login } from "@/components/Login"
import { Button, Stack } from "react-bootstrap"

export default function LoginPage() {
  return (
    <main className="w-full h-full flex flex-col items-center justify-center">
      <Stack gap={3} className="m-20">
        <h4 className="text-lg font-bold">Login</h4>
        <Login />
        <Button href="/register" variant="secondary">
          Register
        </Button>
      </Stack>
    </main>
  )
}
