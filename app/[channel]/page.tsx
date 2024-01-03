"use client"

import { redirect } from "next/navigation"
import { Realtime } from "ably"
import { AblyProvider } from "ably/react"
import { isValid } from "date-fns"

import useSession from "@/hooks/useSession"
import useVideo from "@/hooks/useVideo"
import Chat from "@/components/Chat"
import VideoContainer from "@/components/VideoContainer"

export default function Channel() {
  const { session } = useSession()

  if (!session?.username || !session.channelRef) redirect("/")

  const client = new Realtime.Promise({
    authUrl: "/api/auth",
    useTokenAuth: true,
  })

  const { video, isLoading } = useVideo()

  if (isLoading) return <div>Loading...</div>

  if (!video) return <div>Video not found</div>
  return (
    <AblyProvider client={client}>
      {/* TODO: Fix max height*/}
      <main className="flex flex-1 flex-col lg:flex-row">
        <div className="flex h-full w-full">
          <VideoContainer
            title={video.title}
            url={video.url}
            views={video.views}
            user={video.user}
          />
        </div>
        <div className="flex h-full w-128">
          <Chat username={session.username} channelRef={session.channelRef} />
        </div>
      </main>
    </AblyProvider>
  )
}
