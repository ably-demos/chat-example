"use client"

import { createContext, FC, ReactNode, useMemo } from "react"

import { SessionData } from "@/lib/session"
import { useSession } from "@/hooks/useSession"

import Spinner from "./Spinner"

interface SessionContextProps {
  username: string
}

export const SessionContext = createContext<SessionContextProps | undefined>(
  undefined
)

interface SessionProviderProps {
  children: ReactNode
}

const isValidSession = (
  session: Partial<SessionData> | undefined
): session is SessionData => !!session?.username

/**
 * Provides the current session context, which includes the username.
 * @returns children wrapped in a SessionContext.Provider, or a Spinner if the session is loading
 * @example
 * <SessionProvider>
 *   <UserProfile />
 * </SessionProvider>
 */
export const SessionProvider: FC<SessionProviderProps> = ({ children }) => {
  const { session, isLoading, error } = useSession()
  
  const context = useMemo(
    () => ({ username: session?.username }),
    [session?.username]
  )

  if (isLoading || !isValidSession(context)) return <Spinner />

  return (
    <SessionContext.Provider value={context}>
      {children}
    </SessionContext.Provider>
  )
}
