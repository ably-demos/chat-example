import React from "react"
import { Reaction, SendReactionParams } from "@ably/chat"

import RoomReactions from "./RoomReactions"
import Volume from "./Volume"

type Props = {
  playing: boolean
  volume: number
  onVolumeChange: (volume: number) => void
  onReaction: (params: SendReactionParams) => Promise<void>
  latestRoomReaction?: Reaction
}

const VideoControls = ({
  volume,
  onVolumeChange,
  onReaction,
  latestRoomReaction,
}: Props) => {
  return (
    <div className="absolute bottom-0 left-0 flex w-full bg-gradient-to-t from-black/50 px-5 py-3">
      <div className="flex grow">
        <Volume onChange={onVolumeChange} defaultVolume={volume} defaultMuted />
      </div>
      <div>
        <RoomReactions
          onClick={onReaction}
          latestRoomReaction={latestRoomReaction}
        />
      </div>
    </div>
  )
}

export default VideoControls
