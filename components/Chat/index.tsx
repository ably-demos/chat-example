"use client"

import { useEffect, useState } from "react"
import { useChannel } from "hooks/useChannel"
import { useClient } from "hooks/useClient"
import { useUser } from "hooks/useUser"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

import InviteUsers from "../InviteUsers"
import LoadingDots from "../LoadingDots"
import MessageInput from "../MessageInput"
import MessageList from "../MessageList"
import ChatHeader from "./ChatHeader"

type ChatComponentProps = {
  userId: string
}

const Chat = ({ userId }: ChatComponentProps) => {
  const [client] = useClient(userId)

  const [open, setOpen] = useState(false)
  const [recipient] = useUser(client, "demo")
  const [channel] = useChannel(client, recipient)

  useEffect(() => {
    if (!client) return
    //    TODO: Implement this
    //    client?.getChannels().then(({ channels }): void => {
    //      console.log(channels)
    //      channels.forEach((channel) => {
    //        channel.delete()
    //      })
    //    })
  }, [client])

  async function handleSend(text: string) {
    if (!channel) return
    await channel.sendText(text)
  }

  if (!client || !channel) return <LoadingDots />

  const handleLeave = async () => {
    channel.leave()
  }

  return (
    <>
      <Card className="h-full w-full flex flex-col">
        <CardHeader className="flex flex-row items-center">
          <ChatHeader
            channel={channel}
            onLeave={handleLeave}
            onInviteClick={() => setOpen(true)}
          />
        </CardHeader>
        <CardContent className="flex grow">
          <MessageList channel={channel} />
        </CardContent>
        <CardFooter>
          <MessageInput onSend={handleSend} />
        </CardFooter>
      </Card>
      <InviteUsers
        open={open}
        channel={channel}
        onOpenChange={(value: boolean) => setOpen(value)}
      />
    </>
  )
}

export default Chat
