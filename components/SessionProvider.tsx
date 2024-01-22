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

export const SessionProvider: FC<SessionProviderProps> = ({ children }) => {
  const { session } = useSession()
  console.debug("session", session)
  const context = useMemo(
    () => ({ username: session?.username }),
    [session?.username]
  )

  if (!isValidSession(context)) return <Spinner />
  return (
    <SessionContext.Provider value={context}>
      {children}
    </SessionContext.Provider>
  )
}
