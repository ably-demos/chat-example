"use client"

import { useSearchParams } from "next/navigation"
import { AblyProvider } from "ably/react"

/**
 * Hooks
 */
import { useChannel } from "@/hooks/api/useChannel"
import useSession from "@/hooks/api/useSession"
import useVideo from "@/hooks/api/useVideo"
import { useAblyClient } from "@/hooks/chat/useAblyClient"
import { ChatProvider } from "@/components/ChatProvider"
/**
 * Components
 */
import Conversation from "@/components/Conversation"
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
            />
          </article>
          <aside className="flex size-full lg:max-w-md">
            <Conversation />
          </aside>
        </main>
      </ChatProvider>
    </AblyProvider>
  )
}

export default Watch
