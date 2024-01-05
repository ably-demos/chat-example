"use client"

import { useMemo } from "react"
import { Maybe } from "@/types"
import { Realtime } from "ably/promises"

import { Chat as AblyChat } from "@/components/ably"

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
