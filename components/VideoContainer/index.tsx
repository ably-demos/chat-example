import React from "react"
import clsx from "clsx"
import { PauseIcon, PlayIcon } from "lucide-react"
import ReactPlayer from "react-player/file"

import { Button } from "@/components/ui/button"

import RoomReactions from "./RoomReactions"
import VideoDetail from "./VideoDetail"
import Volume from "./Volume"

type VideoContainerProps = {
  title: string
  url: string
  views: number
  user: {
    username: string
    avatar: string
    subscribers: number
  }
}

const VideoContainer = ({ url, title, views, user }: VideoContainerProps) => {
  const [playing, setPlaying] = React.useState(false)
  const videoRef = React.useRef<ReactPlayer>(null)
  const [volume, setVolume] = React.useState<number>(0.5)

  const handlePlayPause = () => {
    setPlaying((prev) => !prev)
  }

  const handleReaction = (emoji: string) => {
    // TODO: Room Level Reactions
  }

  return (
    <div className="flex size-full justify-center bg-muted">
      <div className="container m-4 flex w-full max-w-[1054px] flex-col">
        <div className="relative mx-auto max-h-[550px] w-full">
          <p
            className={clsx(
              "absolute right-3 animate-pulse  top-1 text-sm rounded-sm bg-primary-foreground px-1 border border-black/10 text-white",
              { "animate-pulse": playing }
            )}
          >
            LIVE
          </p>
          <ReactPlayer
            url={url}
            volume={volume}
            ref={videoRef}
            playing={playing}
            controls={false}
            width={"100%"}
            height={"100%"}
            className="size-auto aspect-video"
          />
          <div className="absolute bottom-0 left-0 flex w-full justify-between bg-gradient-to-t from-black/75 p-3">
            <div className="flex grow">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayPause}
                className="text-white/95"
              >
                {playing ? <PauseIcon /> : <PlayIcon />}
              </Button>
              <Volume
                onChange={setVolume}
                defaultVolume={volume}
                defaultMuted
              />
            </div>
            <div>
              <RoomReactions onClick={handleReaction} />
            </div>
          </div>
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
