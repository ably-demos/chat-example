"use client"

import { useSearchParams } from "next/navigation"
import ChatProvider from "@/providers/ChatProvider"
import MessageProvider from "@/providers/MessageProvider"
import { AblyProvider } from "ably/react"

import { useAblyClient } from "@/hooks/chat/useAblyClient"
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
      <main className="flex flex-1 flex-col lg:flex-row">
        <article className="flex w-full lg:h-full">
          <VideoContainer
            title={video.title}
            url={video.url}
            views={video.views}
            user={video.user}
            live={video.live}
          />
        </article>
        <aside className="flex h-full max-h-full lg:max-w-md">
          <ChatProvider conversationId={channel.name}>
            <MessageProvider>
              <Chat />
            </MessageProvider>
          </ChatProvider>
        </aside>
      </main>
    </AblyProvider>
  )
}

export default Watch
