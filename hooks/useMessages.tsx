"use client"

import { useEffect, useState } from "react"

import { Channel, Message } from "@/types/temp"

export const useMessages = (channel: Maybe<Channel>) => {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    if (!channel) return
    // TODO: implement
    // return channel.connect((message) =>
    //   setMessages((messages) => [...messages, message]),
    // );
  }, [channel])

  return [messages, setMessages] as const
}
