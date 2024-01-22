"use client"

import { useEffect } from "react"
import useSWR from "swr"
import useSWRMutation from "swr/mutation"

import { fetchJson } from "@/lib/fetcher"
import { SessionData } from "@/lib/session"
import { POST } from "@/app/api/session/route"

const sessionApiRoute = "/api/session"

const doCreate = (url: string) => {
  return fetchJson<typeof POST>(url, {
    method: "POST",
  })
}

export const useSession = () => {
  const { data, ...getSession } = useSWR(
    sessionApiRoute,
    fetchJson<SessionData>
  )

  const { trigger: create } = useSWRMutation(sessionApiRoute, (url) =>
    doCreate(url)
  )

  useEffect(() => {
    if (
      !data?.username &&
      getSession.error &&
      getSession.error.status === 404 &&
      !getSession.isLoading
    ) {
      create()
    }
  }, [create, data?.username, getSession.error, getSession.isLoading])

  return {
    session: data,
    createSession: create,
    ...getSession,
  }
}
