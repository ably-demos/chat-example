"use client"

import { useCallback, useEffect, useState } from "react"
import { Maybe } from "@/types"

import { Channel, Client } from "@/types/temp"

export const useChannel = (
  chat: Maybe<Client>,
  recipient?: string /** Should be some user type */
) => {
  const [channel, setChannel] = useState<Channel>()

  const init = useCallback(async () => {
    if (!chat || !recipient) return
    // TODO: implement
    // const { channel: createdChannel } = await chat.conversations.({
    //   user: recipient,
    //   channelData: { name: "Demo Channel" },
    // });
    // setChannel(createdChannel);
  }, [chat, recipient])

  useEffect(() => {
    init()
  }, [init])

  return [channel, setChannel] as const
}
