import { getServerUser } from "@/auth"
import { NavBar } from "@/components/NavBar"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerUser()

  return (
    <div className="flex flex-col h-full">
      <NavBar user={session.user} />
      {children}
    </div>
  )
}
