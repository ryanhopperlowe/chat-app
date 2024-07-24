import { getUsers } from "@/lib/users.server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  console.log("called")

  const username = searchParams.get("username")

  const users = await getUsers({ username })

  return new Response(JSON.stringify(users))
}
