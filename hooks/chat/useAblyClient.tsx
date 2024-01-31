"use client"

import { useEffect, useMemo } from "react"
import { Maybe } from "@/types"
import { Realtime } from "ably/promises"

/**
 * @param username The name of the user
 * @returns Ably client
 *
 * @example
 * const client = useAblyClient(username)
 */
export const useAblyClient = (username: Maybe<string>) => {
  const client = useMemo(() => {
    return username
      ? new Realtime({
          authUrl: "/api/auth",
          restHost: "eu-west-2-a.primary.chat.cluster.ably-nonprod.net",
          realtimeHost: "eu-west-2-a.primary.chat.cluster.ably-nonprod.net",
        })
      : null
  }, [username])

  useEffect(() => {
    return () => {
      // if (
      //   client?.connection.state === "connected" ||
      //   client?.connection.state === "connecting"
      // ) {
      //   client.close()
      // }
    }
  }, [client])

  return client
}
