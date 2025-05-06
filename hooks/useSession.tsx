"use client"

import { useContext } from "react"
import { SessionContext } from "@/providers/SessionProvider"

/**
 * Hook to access the session context
 * @returns session context containing the username
 */
export const useSession = () => {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider")
  }
  return context
}
