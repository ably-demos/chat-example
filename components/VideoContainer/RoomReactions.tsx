import React from "react"

type RoomReactionProps = {}

const reactions = { surprised: "😮", thumbsUp: "👍", heart: "❤️", smile: "😄" }

const RoomReactions = (props: RoomReactionProps) => {
  return (
    <div className="flex">
      {Object.entries(reactions).map(([name, emoji]) => {
        return (
          <button key={name} className="p-2">
            {emoji}
          </button>
        )
      })}
    </div>
  )
}

export default RoomReactions
