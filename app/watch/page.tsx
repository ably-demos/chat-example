"use client"

import {useMemo} from "react"
import {useSearchParams} from "next/navigation"

import {useBots} from "@/hooks/chat/useBots"
/**
 * Hooks
 */
import {useRoom} from "@/hooks/useRoom"
import {useSession} from "@/hooks/useSession"
import {useVideo} from "@/hooks/useVideo"
/**
 * Components
 */
import Chat from "@/components/Chat"
import Spinner from "@/components/Spinner"
import VideoContainer from "@/components/VideoContainer"
import {ChatClientProvider} from "@ably/chat/react";
import {ChatClient} from "@ably/chat";
import * as Ably from "ably";
import {AblyProvider} from "ably/react";
import {RoomProvider} from "@/providers/RoomProvider";

const Watch = () => {
  const searchParams = useSearchParams()
  const roomParam = useMemo(() => searchParams.get("room"), [searchParams])

  const {video, isLoading: isVideoLoading} = useVideo()
  const {session} = useSession()
  const {room, isLoading: isRoomLoading} = useRoom(roomParam)
  useBots(room?.name)

  if (isVideoLoading || isRoomLoading || !room || !session) {
    return <Spinner/>
  }

  const realtimeClient =
    new Ably.Realtime({
      authUrl: `/api/auth?clientId=${session?.username}`,
      clientId: session?.username
    })
  const chatClient = new ChatClient(realtimeClient)
  return (
    <AblyProvider client={realtimeClient}>
      <ChatClientProvider client={chatClient}>
        <RoomProvider roomId={room.name}>
          <main className="flex flex-1 flex-col lg:flex-row">
            <article className="flex h-[50%] w-full lg:h-full">
              <VideoContainer
                title={video.title}
                url={video.url}
                user={video.user}
                live={video.live}
              />
            </article>
            <aside className="flex h-[50%] max-h-full lg:h-full lg:max-w-md">
              <Chat/>
            </aside>
          </main>
        </RoomProvider>
      </ChatClientProvider>
    </AblyProvider>
  )
}

export default Watch
