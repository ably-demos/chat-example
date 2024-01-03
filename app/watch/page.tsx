"use client"

import { useMemo } from "react"
import { redirect, useSearchParams } from "next/navigation"
import { Realtime } from "ably"
import { AblyProvider } from "ably/react"

import { isValidChannel } from "@/lib/channel"
import useSession from "@/hooks/useSession"
import useVideo from "@/hooks/useVideo"
import Chat from "@/components/Chat"
import Spinner from "@/components/Spinner"
import VideoContainer from "@/components/VideoContainer"

const Watch = () => {
  const searchParams = useSearchParams()
  const channel = searchParams.get("channel")
  const { video, isLoading: isVideoLoading } = useVideo()
  const {
    session: { username },
  } = useSession()

  if (!isValidChannel(channel)) {
    redirect("/")
  }

  const client = useMemo(() => {
    return (
      username &&
      new Realtime.Promise({
        authUrl: "/api/auth",
        useTokenAuth: true,
      })
    )
  }, [username])

  if (isVideoLoading || !client) {
    return <Spinner />
  }

  if (!video) return <div>Video not found</div>

  return (
    <AblyProvider client={client}>
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
          <Chat channelId={`chat:${channel}`} />
        </aside>
      </main>
    </AblyProvider>
  )
}

export default Watch
