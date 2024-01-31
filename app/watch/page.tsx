"use client"

import { useSearchParams } from "next/navigation"
import ChatProvider from "@/providers/ChatProvider"
import { AblyProvider } from "ably/react"

import { useAblyClient } from "@/hooks/chat/useAblyClient"
import { useBots } from "@/hooks/chat/useBots"
/**
 * Hooks
 */
import { useChannel } from "@/hooks/useChannel"
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
  const channelParam = searchParams.get("channel")

  const { video, isLoading: isVideoLoading } = useVideo()
  const { session } = useSession()
  const { channel, isLoading: isChannelLoading } = useChannel(channelParam)

  useBots(channel?.name)

  const client = useAblyClient(session?.username)

  if (isVideoLoading || isChannelLoading || !client || !channel || !session) {
    return <Spinner />
  }

  if (!video) return <div>Video not found</div>

  return (
    <AblyProvider client={client}>
      <main className="flex flex-1 flex-col lg:flex-row">
        <article className="flex h-[50%] w-full lg:h-full">
          <VideoContainer
            title={video.title}
            url={video.url}
            views={video.views}
            user={video.user}
            live={video.live}
          />
        </article>
        <aside className="flex h-[50%] max-h-full lg:h-full lg:max-w-md">
          <ChatProvider conversationId={channel.name}>
            <Chat />
          </ChatProvider>
        </aside>
      </main>
    </AblyProvider>
  )
}

export default Watch
