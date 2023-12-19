"use client"

import { useCallback, useEffect, useState } from "react"
import { Chat, User } from "@pubnub/chat"

export const useUser = (chat: Chat | undefined, userId: string) => {
  const [user, setUser] = useState<Maybe<User>>()

  const init = useCallback(async () => {
    if (!chat) return
    console.info("Getting user")
    let user = await chat.getUser(userId)
    if (!user) {
      console.info("Nonexistent user, creating...")
      user = await chat.createUser(userId, {})
    }

    setUser(user)
  }, [chat, userId])

  useEffect(() => {
    init()
  }, [init])

  return [user, setUser] as const
}
