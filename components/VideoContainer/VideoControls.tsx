import React from "react"
import { PauseIcon, PlayIcon, SkipForwardIcon } from "lucide-react"

import { Button } from "../ui/button"
import RoomReactions from "./RoomReactions"
import Volume from "./Volume"

type Props = {
  playing: boolean
  volume: number
  onPlayPause: () => void
  onVolumeChange: (volume: number) => void
  onReaction: (emoji: string) => void
}

const VideoControls = ({
  playing,
  volume,
  onPlayPause,
  onVolumeChange,
  onReaction,
}: Props) => {
  return (
    <div className="absolute bottom-0 left-0 flex w-full bg-gradient-to-t from-black/50 px-5 py-3">
      <div className="flex grow">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPlayPause}
          className="text-white/95"
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-white/95"
        >
          {<SkipForwardIcon />}
        </Button>
        <Volume onChange={onVolumeChange} defaultVolume={volume} defaultMuted />
      </div>
      <div>
        <RoomReactions onClick={onReaction} />
      </div>
    </div>
  )
}

export default VideoControls
