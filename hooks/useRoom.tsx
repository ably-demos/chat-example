import { useEffect, useMemo } from "react"
import { redirect } from "next/navigation"
import { Room } from "@prisma/client"
import useSWR from "swr"
import useSWRMutation from "swr/mutation"

import { fetchJson } from "@/lib/fetcher"
import { isValidRoom } from "@/lib/room"

const roomApiRoute = "/api/rooms"

function doCreate(url: string, body: { name: string | null }) {
  return fetchJson<Room>(url, {
    method: "POST",
    body: JSON.stringify(body),
  })
}

/**
 *
 * @param name The name of the room
 * @returns room, error, isLoading
 */
export const useRoom = (name: string | null) => {
  const cacheKey = name ? `${roomApiRoute}/${name}` : null

  const {
    data: room,
    error,
    isLoading,
  } = useSWR<Room>(cacheKey, fetchJson<Room>)

  const { trigger: create } = useSWRMutation(`${cacheKey}`, () =>
    doCreate(roomApiRoute, { name })
  )

  useEffect(() => {
    if (isLoading || room?.id) return

    if (isValidRoom(name)) {
      create()
    } else {
      redirect("/")
    }
  }, [room?.id, name, create, isLoading])

  return useMemo(() => ({ room, error, isLoading }), [room, error, isLoading])
}
