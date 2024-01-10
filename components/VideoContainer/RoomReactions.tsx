import React from "react"

import Reaction from "@/components/Reaction"

type RoomReactionProps = {
  onClick: (emoji: string) => void
}

const reactions = {
  smile: "1f603",
  hushed: "1f62f",
  thumbsUp: "1f44d",
  redHeart: "2764-fe0f",
}

const RoomReactions = ({ onClick: handleClick }: RoomReactionProps) => {
  return (
    <div className="flex">
      {Object.entries(reactions).map(([name, charCode]) => {
        return (
          <button key={name} className="p-2">
            <Reaction onClick={handleClick} unified={charCode} />
          </button>
        )
      })}
    </div>
  )
}

export default RoomReactions
