import { auth, signIn } from "@/auth"
import { NavBar } from "@/components/NavBar"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq, not } from "drizzle-orm"
import { redirect } from "next/navigation"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }
  console.log(session.user)

  return (
    <>
      <NavBar />
      {children}
    </>
  )
}
