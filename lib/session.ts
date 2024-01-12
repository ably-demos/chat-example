import { cookies } from "next/headers"
import { getIronSession } from "iron-session"

export interface SessionData {
  username: string
}

export const getSession = async (
  cookieStore: ReturnType<typeof cookies> = cookies()
) =>
  getIronSession<SessionData>(cookieStore, {
    cookieName: "session",
    password: process.env.SESSION_SECRET!,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  })
