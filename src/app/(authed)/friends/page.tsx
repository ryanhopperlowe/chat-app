import { getServerUser } from "@/auth"
import { LetterIcon } from "@/components/LetterIcon"
import { RemoveFriend } from "@/components/RemoveFriend"
import { getFriendsByUserId } from "@/lib/users.server"
import { User } from "@nextui-org/react"

export default async function MyFriendsPage() {
  const { user } = await getServerUser()
  const { data: friends } = (await getFriendsByUserId(user.id)) || {}

  if (!friends?.length) {
    return <div>You have no friends</div>
  }

  return (
    <div className="flex flex-col gap-4 w-full justify-center">
      {friends.map((friend) => (
        <div
          key={friend.id}
          className="flex gap-2 align-middle border-b p-4 justify-between"
        >
          <User
            name={friend.username}
            avatarProps={{
              icon: <LetterIcon letter={friend.username.charAt(0)} />,
            }}
          />

          <RemoveFriend userId={user.id} friendId={friend.id} />
        </div>
      ))}
    </div>
  )
}
