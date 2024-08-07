"use client"

import { useMemo } from "react"
import { useSearchParams } from "next/navigation"
import ChatProvider from "@/providers/ChatProvider"
import { AblyProvider } from "ably/react"

import { useAblyClient } from "@/hooks/chat/useAblyClient"
import { useBots } from "@/hooks/chat/useBots"
/**
 * Hooks
 */
import { useRoom } from "@/hooks/useRoom"
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
  const { session } = useSession()
  const { room, isLoading: isRoomLoading } = useRoom(roomParam)

  useBots(room?.name)

  const client = useAblyClient(session?.username)

  if (isVideoLoading || isRoomLoading || !client || !room || !session) {
    return <Spinner />
  }

  if (!video) return <div>Video not found</div>

  return (
    <AblyProvider client={client}>
      <main className="flex flex-1 flex-col lg:flex-row">
        <article className="flex h-[50%] w-full lg:h-full">
          <ChatProvider roomId={room.name}>
            <VideoContainer
              title={video.title}
              url={video.url}
              user={video.user}
              live={video.live}
            />
          </ChatProvider>
        </article>
        <aside className="flex h-[50%] max-h-full lg:h-full lg:max-w-md">
          <ChatProvider roomId={room.name}>
            <Chat />
          </ChatProvider>
        </aside>
      </main>
    </AblyProvider>
  )
}

export default Watch
