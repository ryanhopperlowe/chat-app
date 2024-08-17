import { create } from "zustand"
import Pusher from "pusher-js"

Pusher.logToConsole = process.env.NODE_ENV === "development"

type PusherStore = {
  pusherClient: Pusher | null
  initPusherClient: () => void
}

export const usePusherStore = create<PusherStore>()((set, get) => ({
  pusherClient: null as Pusher | null,
  initPusherClient: () => {
    const existingClient = get().pusherClient

    if (existingClient) {
      return
    }

    const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    })

    set({ pusherClient })
  },
}))
