"use client"

import { useEffect, useState } from "react"

import { Client } from "@/types/temp"

export function useClient(userId: string) {
  const [client, setClient] = useState<Client>()

  useEffect(() => {
    if (!userId) return
    // TODO: implement
    // setClient(new Chat(process.env.ABLY_API_KEY));
  }, [userId])

  return [client, setClient] as const
}
