import { FriendsNav } from "@/components/FriendsNav"

export default function FriendsPage({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full">
      <section className="flex flex-col gap-4 p-4">
        <FriendsNav />
      </section>

      <main className="flex-1 p-4">{children}</main>
    </div>
  )
}
