"use client"

import { useMemo } from "react"
import { Maybe } from "@/types"
import { Chat as AblyChat } from "@ably-labs/chat"
import { Realtime } from "ably/promises"

export const useClient = (username: Maybe<string>) => {
  const client = useMemo(() => {
    return username
      ? new Realtime({
          authUrl: "/api/auth",
          useTokenAuth: true,
        })
      : undefined
  }, [username])

  return useMemo(() => (client ? new AblyChat(client) : undefined), [client])
}
