"use client"

import { useSearchParams } from "next/navigation"
import { AblyProvider } from "ably/react"

import { useAblyClient } from "@/hooks/useAblyClient"
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
import ChatProvider from "@/components/ChatProvider"
import Spinner from "@/components/Spinner"
import VideoContainer from "@/components/VideoContainer"

const Watch = () => {
  const searchParams = useSearchParams()
  const channelParam = searchParams.get("channel")

  // TODO: Clean up channel id's/params

  const { video, isLoading: isVideoLoading } = useVideo()
  const { session } = useSession()

  const { channel, isLoading: isChannelLoading } = useChannel(channelParam)

  const client = useAblyClient(session?.username)

  if (isVideoLoading || isChannelLoading || !client || !channel || !session) {
    return <Spinner />
  }

  if (!video) return <div>Video not found</div>

  return (
    <AblyProvider client={client}>
      <ChatProvider conversationId={channel.name}>
        <main className="flex flex-1 flex-col lg:flex-row">
          <article className="flex size-full">
            <VideoContainer
              title={video.title}
              url={video.url}
              views={video.views}
              user={video.user}
              live={video.live}
            />
          </article>
          <aside className="flex size-full lg:max-w-md">
            <Chat />
          </aside>
        </main>
      </ChatProvider>
    </AblyProvider>
  )
}

export default Watch
