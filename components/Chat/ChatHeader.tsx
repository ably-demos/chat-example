import React from "react"

import { Separator } from "@/components/ui/separator"

type ChatHeaderProps = {
  title?: string
}

const ChatHeader = ({ title = "Chat" }: ChatHeaderProps) => {
  return (
    <div className="flex w-full flex-col">
      <div className="space-between flex w-full items-center space-x-4">
        <p className="grow text-lg font-medium leading-none">{title}</p>
      </div>
      <Separator className="my-4" />
      <div className="flex">
        <p className="content-center text-sm text-muted-foreground">
          Welcome to the chat room! Remember to be nice and avoid using
          offensive language. This demo has some dummy users streaming messages
          to recreate the experience of a livestream chat.
        </p>
      </div>
    </div>
  )
}

export default ChatHeader
