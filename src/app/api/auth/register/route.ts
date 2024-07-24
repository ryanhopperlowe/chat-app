import { db } from "@/db"
import { users } from "@/db/schema"
import { hash } from "bcryptjs"

export async function POST(req: Request) {
  const { username, password } = await req.json()

  if (!username || !password) {
    return new Response("Username and password are required.", { status: 400 })
  }

  const passwordHash = await hash(password, 10)

  const user = await db.insert(users).values({
    passwordHash,
    username: username,
  })

  console.log(user)

  return new Response(JSON.stringify(user), { status: 201 })
}
