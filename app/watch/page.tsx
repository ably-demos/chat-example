"use client"

import React, { useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { ChatClient, LogLevel } from "@ably/chat"
import { ChatClientProvider, ChatRoomProvider } from "@ably/chat/react"
import { AblyProvider } from "ably/react"

import { useAblyClient } from "@/hooks/chat/useAblyClient"
import { useBots } from "@/hooks/chat/useBots"
/**
 * Hooks
 */
import { useLoadCreateRoom } from "@/hooks/useLoadCreateRoom"
import { useSession } from "@/hooks/useSession"
import { useVideo } from "@/hooks/useVideo"
/**
 * Components
 */
import Chat from "@/components/Chat"
import Spinner from "@/components/Spinner"
import VideoContainer from "@/components/VideoContainer"

const Watch = () => {
  const searchParams = useSearchParams()
  const roomParam = useMemo(() => searchParams.get("room"), [searchParams])

  const { video, isLoading: isVideoLoading } = useVideo()
  const { username } = useSession()
  const { room, isLoading: isRoomLoading } = useLoadCreateRoom(roomParam)

  const client = useAblyClient(username)

  const chatClient = useMemo(() => {
    if (client) {
      return new ChatClient(client, {
        logLevel: LogLevel.Debug,
        logHandler: console.log,
      })
    }
    return null
  }, [client])


  if (isVideoLoading || isRoomLoading || !client || !room || !chatClient) {
    return <Spinner />
  }

  if (!video) return <div>Video not found</div>

  return (
    <AblyProvider client={client}>
      <ChatClientProvider client={chatClient}>
        <ChatRoomProvider
          id={room.name}
          options={{ occupancy: { enableEvents: true } }}
        >
          <ChatContainer roomId={room.id} video={video} />
        </ChatRoomProvider>
      </ChatClientProvider>
    </AblyProvider>
  )
}

interface ChatContainerProps {
  roomId: string
  video: {
    title: string
    url: string
    live: boolean
  }
}

const ChatContainer: React.FC<ChatContainerProps> = ({ video }) => {
  if (!video) return <div>Video not found</div>
  return (
    <main className="flex flex-1 flex-col lg:flex-row">
      <article className="flex h-[50%] w-full lg:h-full">
        <VideoContainer title={video.title} url={video.url} live={video.live} />
      </article>
      <aside className="flex h-[50%] max-h-full lg:h-full lg:max-w-md">
        <Chat />
      </aside>
    </main>
  )
}

export default Watch
