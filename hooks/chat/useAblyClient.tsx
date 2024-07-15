"use client"

import { useMemo } from "react"
import { Maybe } from "@/types"
import * as Ably from "ably"

/**
 * @param username The name of the user
 * @returns Ably client
 *
 * @example
 * const client = useAblyClient(username)
 */
export const useAblyClient = (username: Maybe<string>) => {
  return useMemo(() => {
    console.log("Getting a new client, do we have a username?", username)
    return username
      ? new Ably.Realtime({
          authUrl: `/api/auth?clientId=${username}`,
          clientId: username,
        })
      : null
  }, [username])
}
