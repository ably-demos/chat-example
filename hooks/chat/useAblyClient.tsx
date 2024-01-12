"use client"

import { useEffect, useMemo } from "react"
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

  useEffect(() => {
    console.debug("Opening Ably client connection")
    return () => {
      console.debug("Closing Ably client connection")
      // client?.close()
    }
  }, [client])

  return client
}
