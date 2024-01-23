import React from "react"
import clsx from "clsx"
import ReactPlayer from "react-player/file"

import VideoControls from "./VideoControls"
import VideoDetail from "./VideoDetail"

type VideoContainerProps = {
  title: string
  url: string
  views: number
  live: boolean
  user: {
    username: string
    avatar: string
    subscribers: number
  }
}

const VideoContainer = ({
  live,
  url,
  title,
  views,
  user,
}: VideoContainerProps) => {
  const [playing, setPlaying] = React.useState(false)
  const videoRef = React.useRef<ReactPlayer>(null)
  const [volume, setVolume] = React.useState<number>(0.5)

  const handlePlayPause = () => {
    setPlaying((prev) => !prev)
  }

  const handleReaction = (emoji: string) => {
    // XXX: Room Level Reactions
    console.warn("unimplemented")
  }

  return (
    <div className="flex size-full justify-center bg-muted">
      <div className="container my-10 flex w-full max-w-[1054px] flex-col">
        <div className="relative mx-auto w-full overflow-hidden rounded-2xl">
          <p
            className="absolute right-5 top-5 w-16 rounded-sm bg-live text-center "
          >
            <span className="font-semibold leading-6 text-white">LIVE</span>
          </p>
          <ReactPlayer
            url={url}
            volume={volume}
            ref={videoRef}
            playing={playing}
            controls={false}
            width={"100%"}
            height={"100%"}
            className="aspect-video size-auto"
          />
          <VideoControls
            playing={playing}
            volume={volume}
            onPlayPause={handlePlayPause}
            onVolumeChange={setVolume}
            onReaction={handleReaction}
          />
        </div>
        <VideoDetail
          title={title}
          views={views}
          username={user.username}
          avatar={user.avatar}
          subscribers={user.subscribers}
        />
      </div>
    </div>
  )
}

export default VideoContainer
