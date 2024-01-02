import useSWR from "swr"
import useSWRMutation from "swr/mutation"

import { fetchJson } from "@/lib/fetcher"
import { defaultSession, SessionData } from "@/lib/session"

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
  const { data: session, isLoading } = useSWR(
    sessionApiRoute,
    fetchJson<SessionData>,
    {
      fallbackData: defaultSession,
    }
  )

  const { trigger: create } = useSWRMutation(sessionApiRoute, doCreate, {
    // the login route already provides the updated information, no need to revalidate
    revalidate: false,
  })
  const { trigger: reset } = useSWRMutation(sessionApiRoute, doReset)

  return { session, reset, create, isLoading }
}
