"use client"

import { useCallback, useEffect, useState } from "react"
import { Maybe } from "@/types"

import { User } from "@/types/temp"

export const useUser = (chat: undefined, userId: string) => {
  const [user, setUser] = useState<Maybe<User>>()

  const init = useCallback(async () => {
    // if (!chat) return
    // console.info("Getting user")
    // let user = await chat.getUser(userId)
    // if (!user) {
    //   console.info("Nonexistent user, creating...")
    //   user = await chat.createUser(userId, {})
    // }
    // setUser(user)
  }, [])

  useEffect(() => {
    init()
  }, [init])

  return [user, setUser] as const
}
