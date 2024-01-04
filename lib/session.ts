import { cookies } from "next/headers"
import { faker } from "@faker-js/faker/locale/en_GB"
import { getIronSession } from "iron-session"

export interface SessionData {
  username: string | null
}

export const getSession = async (cookieStore: ReturnType<typeof cookies>) =>
  getIronSession<SessionData>(cookieStore, {
    cookieName: "session",
    password: process.env.SESSION_SECRET!,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  })

export const defaultSession: SessionData = {
  username: null,
}

/**
 * Generate a session for the user.
 *
 * @param currentChannel The current channel the user is in, or null if none.
 * @returns The generated session.
 */
export const generateSession = (username?: string | null): SessionData => ({
  username: username ?? faker.internet.userName(),
})

export const hasValidSession = (
  session: SessionData | null
): session is NonNullable<SessionData> => session?.username !== null
