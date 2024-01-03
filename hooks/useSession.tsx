import useSWR from "swr"
import useSWRMutation from "swr/mutation"

import { fetchJson } from "@/lib/fetcher"
import { defaultSession, getSession, SessionData } from "@/lib/session"

const sessionApiRoute = "/api/session"

function doCreate(url: string) {
  return fetchJson<SessionData>(url, {
    method: "POST",
  })
}

function doReset(url: string) {
  return fetchJson<SessionData>(url, {
    method: "DELETE",
  })
}

export default function useSession() {
  const { data, ...getSession } = useSWR(
    sessionApiRoute,
    fetchJson<SessionData>,
    {
      fallbackData: defaultSession,
    }
  )

  const { trigger: create } = useSWRMutation(
    sessionApiRoute,
    (url) => doCreate(url),
    {
      // the login route already provides the updated information, no need to revalidate
      revalidate: false,
    }
  )

  const { trigger: reset } = useSWRMutation(sessionApiRoute, doReset)

  return {
    session: data,
    resetSession: reset,
    createSession: create,
    ...getSession,
  }
}
