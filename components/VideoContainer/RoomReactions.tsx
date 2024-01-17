import React, { useCallback, useState } from "react"
import { nanoid } from "nanoid"

import Reaction from "@/components/Reaction"

import Emoji from "../Emoji"

import "./styles.css"

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
  const [activeReactions, setActiveReactions] = useState(
    Object.keys(reactions).reduce(
      (acc, key) => {
        acc[key] = []
        return acc
      },
      {} as Record<string, string[]>
    )
  )

  const handleAddReaction = useCallback(
    (name: string) => {
      const id = nanoid()
      setActiveReactions((prev) => {
        return {
          ...prev,
          [name]: [...prev[name], id],
        }
      })
      setTimeout(() => {
        setActiveReactions((prev) => ({
          ...prev,
          [name]: prev[name].filter((r) => r !== id),
        }))
      }, 2000)
      handleClick(reactions[name as keyof typeof reactions])
    },
    [handleClick]
  )

  return (
    <ol className="flex">
      {Object.entries(reactions).map(([name, charCode]) => {
        return (
          <li key={name} className="relative">
            <div className="h-0">
              {activeReactions[name]?.map((reaction) => {
                return (
                  <Emoji
                    key={reaction}
                    size={24}
                    className={`FadingReaction ${reaction}`}
                    unified={reactions[name as keyof typeof reactions]}
                  />
                )
              })}
            </div>
            <Reaction
              unified={charCode}
              onClick={() => handleAddReaction(name)}
            />
          </li>
        )
      })}
    </ol>
  )
}

export default RoomReactions
