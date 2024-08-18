import { FriendsNav } from "@/components/FriendsNav"

export default function FriendsPage({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      <section className="flex flex-col gap-4 p-4">
        <FriendsNav />
      </section>

      <main>{children}</main>
    </div>
  )
}
