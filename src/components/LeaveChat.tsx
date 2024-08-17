"use client"

import { useAction } from "next-safe-action/hooks"
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react"
import { useRouter } from "next/navigation"
import { removeUserFromChat } from "@/lib/chats.server"
import { Chat } from "@/db/schema"

export function LeaveChat({ chat, userId }: { chat: Chat; userId: number }) {
  const router = useRouter()
  const leaveChat = useAction(removeUserFromChat)
  const modal = useDisclosure()

  const handleDeleteChat = async () => {
    await leaveChat.executeAsync({ chatId: chat.id, userId })
    router.push("/chats")
  }

  return (
    <>
      <Button onClick={modal.onOpenChange} color="danger" size="sm">
        Leave Chat
      </Button>
      <Modal
        isOpen={modal.isOpen}
        onOpenChange={modal.onOpenChange}
        className="flex items-center justify-center"
      >
        <ModalContent className="w-full max-w-md bg-white rounded-lg p-6 shadow-lg">
          <ModalHeader>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Leave chat
            </h3>
          </ModalHeader>
          <ModalBody className="mt-4">
            <p className="text-sm text-gray-500">
              Are you sure you want to leave the chat{" "}
              <strong>{chat.name}</strong>?
            </p>
            <p className="text-sm text-gray-500">
              You will no longer be able to send messages to this chat.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              onClick={handleDeleteChat}
              className="mr-auto"
            >
              Delete
            </Button>
            <Button onClick={modal.onClose} color="secondary">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
