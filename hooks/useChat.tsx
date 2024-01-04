import { useMemo } from "react"
import { Chat } from "@ably-labs/chat"
import { useAbly } from "ably/react"

export const useChat = () => {
  const ably = useAbly()
  return useMemo(() => (ably ? new Chat(ably) : undefined), [ably])
}
