import React from "react"
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
    name: string
    avatar: string
    subscribers: number
  }
  onReaction: (emoji: string) => void
}

const VideoContainer = ({
  url,
  title,
  views,
  user,
  onReaction,
}: VideoContainerProps) => {
  const [playing, setPlaying] = React.useState(false)
  const videoRef = React.useRef<ReactPlayer>(null)
  const [volume, setVolume] = React.useState(0.5)

  const handlePlayPause = () => {
    setPlaying((prev) => !prev)
  }

  return (
    <div className="flex h-full w-full justify-center bg-muted">
      <div className="container m-4 flex w-full flex-col">
        <div className="relative w-full ">
          <ReactPlayer
            url={url}
            volume={volume}
            ref={videoRef}
            playing={playing}
            controls={false}
            width={"100%"}
            height={"100%"}
            className="m-auto aspect-video h-auto w-auto"
          />
          <div className="absolute bottom-0 left-0 flex w-full justify-between bg-gradient-to-t from-black/75 px-2">
            <div className="flex w-full">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayPause}
                className="text-white/95"
              >
                {playing ? <PauseIcon /> : <PlayIcon />}
              </Button>
              <Volume onChange={setVolume} />
            </div>
            <div>
              <RoomReactions onClick={onReaction} />
            </div>
          </div>
        </div>
        <VideoDetail
          views={views}
          username={user.name}
          avatar={user.avatar}
          subscribers={user.subscribers}
        />
      </div>
    </div>
  )
}

export default VideoContainer
