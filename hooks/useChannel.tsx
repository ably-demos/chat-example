import { useEffect, useMemo } from "react"
import { redirect } from "next/navigation"
import { Channel } from "@prisma/client"
import useSWR from "swr"
import useSWRMutation from "swr/mutation"

import { isValidChannel } from "@/lib/channel"
import { fetchJson } from "@/lib/fetcher"

const channelApiRoute = "/api/channels"

function doCreate(url: string, body: { name: string | null }) {
  return fetchJson<Channel>(url, {
    method: "POST",
    body: JSON.stringify(body),
  })
}

/**
 *
 * @param name The name of the channel
 * @returns channel, error, isLoading
 */
export const useChannel = (name: string | null) => {
  const cacheKey = name ? `${channelApiRoute}/${name}` : null

  const {
    data: channel,
    error,
    isLoading,
  } = useSWR<Channel>(cacheKey, fetchJson<Channel>)

  const { trigger: create } = useSWRMutation(`${cacheKey}`, () =>
    doCreate(channelApiRoute, { name })
  )

  useEffect(() => {
    if (isLoading || channel?.id) return

    if (isValidChannel(name)) {
      create()
    } else {
      redirect("/")
    }
  }, [channel?.id, name, create, isLoading])

  return useMemo(
    () => ({ channel, error, isLoading }),
    [channel, error, isLoading]
  )
}
