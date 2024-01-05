import { useMemo } from "react"
import { useAbly } from "ably/react"

import { Chat } from "@/components/ably"

export const useChat = () => {
  const ably = useAbly()
  return useMemo(() => (ably ? new Chat(ably) : undefined), [ably])
}
