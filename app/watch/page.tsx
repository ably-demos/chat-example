"use client"

import { redirect, useSearchParams } from "next/navigation"
import { ChatProvider } from "@/providers/ChatProvider"

import { isValidChannel } from "@/lib/channel"
/**
 * Hooks
 */
import { useClient } from "@/hooks/useClient"
import useSession from "@/hooks/useSession"
import useVideo from "@/hooks/useVideo"
/**
 * Components
 */
import Conversation from "@/components/Conversation"
import Spinner from "@/components/Spinner"
import VideoContainer from "@/components/VideoContainer"

const Watch = () => {
  const searchParams = useSearchParams()
  const conversationId = searchParams.get("channel")
  const { video, isLoading: isVideoLoading } = useVideo()
  const {
    session: { username },
  } = useSession()

  if (!isValidChannel(conversationId)) {
    redirect("/")
  }

  const client = useClient(username)

  if (isVideoLoading || !client) {
    return <Spinner />
  }

  if (!video) return <div>Video not found</div>

  if (!conversationId) return <div>Conversation not found</div>

  return (
    <ChatProvider client={client} conversationId={conversationId}>
      <main className="flex flex-1 flex-col lg:flex-row">
        <article className="flex h-full w-full">
          <VideoContainer
            title={video.title}
            url={video.url}
            views={video.views}
            user={video.user}
          />
        </article>
        <aside className="flex h-full w-128">
          <Conversation conversationId={conversationId} />
        </aside>
      </main>
    </ChatProvider>
  )
}

export default Watch
