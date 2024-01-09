"use client"

import { useMemo } from "react"
import { Maybe } from "@/types"
import { Realtime } from "ably/promises"

export const useAblyClient = (username: Maybe<string>) => {
  const client = useMemo(() => {
    return username
      ? new Realtime({
          authUrl: "/api/auth",
          useTokenAuth: true,
        })
      : undefined
  }, [username])

  return client
}
