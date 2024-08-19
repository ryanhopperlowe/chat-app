import AddFriend from "@/components/AddFriend"
import { LetterIcon } from "@/components/LetterIcon"
import { searchUsers } from "@/lib/users.server"
import { User } from "@nextui-org/react"

export default async function FindFriendsPage() {
  const getUsers = await searchUsers({
    isRequested: false,
    isFriend: false,
    hideSelf: true,
  })

  if (!getUsers?.data) {
    return <div>No users found</div>
  }

  return (
    <div className="flex flex-col gap-4 w-full justify-center">
      {getUsers.data.map((user) => (
        <div
          key={user.id}
          className="flex gap-2 align-middle border-b p-4 justify-between"
        >
          <User
            name={user.username}
            avatarProps={{
              icon: <LetterIcon letter={user.username.charAt(0)} />,
            }}
          />

          <AddFriend friendId={user.id} />
        </div>
      ))}
    </div>
  )
}
