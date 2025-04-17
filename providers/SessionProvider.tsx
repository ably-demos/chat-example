"use client"

import {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react"

import { fetchJson } from "@/lib/fetcher"
import { SessionData } from "@/lib/session"

import Spinner from "../components/Spinner"

interface SessionContextProps {
  username: string
  avatar: string
}
export const SessionContext = createContext<SessionContextProps | undefined>(
  undefined
)

interface SessionProviderProps {
  children: ReactNode
  /**
   * Optional username to check or create.
   * If undefined, a new session is created automatically (POST).
   * If defined, we first attempt to fetch the session via GET, and if mismatched or missing, we fallback to POST.
   */
  username?: string
}

const sessionApiRoute = "/api/session"

/**
 * GETs the session from the server.
 * @throws Error if the fetch fails
 */
async function fetchSession(username: string): Promise<SessionData> {
  const url = username
    ? `${sessionApiRoute}?username=${encodeURIComponent(username)}`
    : sessionApiRoute
  const response = await fetchJson<{ session: SessionData }>(url, {
    method: "GET",
  })
  return response.session
}

/**
 * POSTs to create (or update) the session on the server.
 * @param usernameToCreate if provided, it’s included in the request body
 * @throws Error if the creation fails
 */
async function createSession(usernameToCreate?: string): Promise<SessionData> {
  const response = await fetchJson<{ session: SessionData }>(sessionApiRoute, {
    method: "POST",
    body: JSON.stringify({ username: usernameToCreate }),
    headers: {
      "Content-Type": "application/json",
    },
  })
  return response.session
}

export const SessionProvider: FC<SessionProviderProps> = ({
  children,
  username,
}) => {
  const [session, setSession] = useState<SessionData | undefined>(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!session) return
    // Store the username in sessionStorage for later page loads
    sessionStorage.setItem("ably-chat-demo-clientId", session.username)
    sessionStorage.setItem("ably-chat-demo-clientId-avatar", session.avatar)
  }, [session])

  useEffect(() => {
    const initSession = async () => {
      setIsLoading(true)
      try {
        if (!username) {
          const newSession = await createSession()
          setSession(newSession)
        } else {
          try {
            const existingSession = await fetchSession(username)

            if (existingSession.username !== username) {
              const newSession = await createSession(username)
              setSession(newSession)
            } else {
              setSession(existingSession)
            }
          } catch (err) {
            const newSession = await createSession(username)
            setSession(newSession)
          }
        }
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    // Check if we already have a session in sessionStorage
    const clientId = sessionStorage.getItem("ably-chat-demo-clientId")
    const avatar = sessionStorage.getItem("ably-chat-demo-clientId-avatar")
    if (clientId) {
      setSession({ username: clientId, avatar: avatar || "" })
      setIsLoading(false)
      return
    }

    void initSession()
  }, [username])

  // Prepare context value (null if session is invalid)
  const contextValue = useMemo(() => {
    if (!session || !session.username) return undefined
    return { username: session.username, avatar: session.avatar }
  }, [session])

  // Display spinner while loading
  if (isLoading) {
    return (
      <div className="flex size-full">
        <Spinner />
      </div>
    )
  }

  // If we haven’t validly set context, show a fallback or error
  // (You could choose to render children anyway, depending on your use-case)
  if (!contextValue || error) {
    return (
      <div className="flex size-full items-center justify-center">
        <p className="text-red-600">
          {error
            ? `Error initializing session: ${error.message}`
            : "Invalid session"}
        </p>
      </div>
    )
  }

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  )
}
