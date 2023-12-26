import { cookies } from "next/headers"
import { faker } from "@faker-js/faker"
import { getIronSession } from "iron-session"
import { generate } from "random-words"

export interface SessionData {
  username: string | null
  channelRef: string | null
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
  channelRef: null,
}

export const generateSession = (): SessionData => ({
  username: faker.internet.userName(),
  channelRef: "writing-though-palace", //generate({ exactly: 3, minLength: 6, join: "-" }),
})
