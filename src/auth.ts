import { compare } from "bcryptjs"
import NextAuth, { Session } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { db } from "./db"
import { User, users } from "./db/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      // @ts-ignore
      authorize: async (credentials) => {
        // logic to salt and hash password
        const userResponse = await db.query.users.findFirst({
          where: eq(users.username, credentials.username as string),
        })

        if (!userResponse) {
          // No user found, so this is their first attempt to login
          // meaning this is also the place you could do registration
          throw new Error("User not found.")
        }

        const { passwordHash, ...user } = userResponse

        if (!(await compare(credentials.password as string, passwordHash))) {
          throw new Error("Incorrect password.")
        }

        // return user object with the their profile data
        return user
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.user = user
      }
      return token
    },
    async session({ session, token, user }) {
      // @ts-ignore
      session.user = token.user
      return session
    },
  },
})

export function convertSession(session: Session) {
  return {
    ...session,
    user: {
      ...session.user,
      id: +session.user.id,
    },
  }
}

export async function getServerUser(): Promise<{ user: User }> {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return {
    user: convertSession(session).user,
  }
}
