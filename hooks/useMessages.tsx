"use client"

import { useEffect, useState } from "react"
import { Maybe } from "@/types"

import { Channel, Message } from "@/types/temp"

export const useMessages = (channel: Maybe<Channel>) => {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    if (!channel) return
    // TODO: Implement
    // return channel.connect((message) =>
    //   setMessages((messages) => [...messages, message]),
    // );
  }, [channel])

  return [messages, setMessages] as const
}
