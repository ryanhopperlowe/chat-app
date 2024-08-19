import { getServerUser } from "@/auth"
import { FriendRequestActions } from "@/components/FriendRequestActions"
import { LetterIcon } from "@/components/LetterIcon"
import { getReceivedFriendRequestsByUserId } from "@/lib/users.server"
import { User } from "@nextui-org/react"

export default async function FriendRequestsPage() {
  const { user } = await getServerUser()
  const getRequests = await getReceivedFriendRequestsByUserId(user.id)

  if (!getRequests?.data?.length) {
    return <div>You have no friend requests</div>
  }

  return (
    <div className="flex flex-col gap-4 w-full justify-center">
      {getRequests.data.map((request) => (
        <div
          key={request.id}
          className="flex gap-2 align-middle border-b p-4 justify-between"
        >
          <User
            name={request.from.username}
            avatarProps={{
              icon: <LetterIcon letter={request.from.username.charAt(0)} />,
            }}
          />

          <FriendRequestActions requestId={request.id} />
        </div>
      ))}
    </div>
  )
}
