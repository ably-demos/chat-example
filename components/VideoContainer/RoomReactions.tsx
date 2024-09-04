import React, { useCallback, useEffect, useState } from "react"
import { nanoid } from "nanoid"

import "./styles.css"

import { Reaction, SendReactionParams } from "@ably/chat"

import FloatingReaction from "./FloatingReaction"
import ReactionButton from "./ReactionButton"

type RoomReactionProps = {
  onClick: (params: SendReactionParams) => Promise<void>
  latestRoomReaction?: Reaction
}

const reactions = {
  openMouth: "1f62e",
  heart: "2764-fe0f",
  thumbsUp: "1f44d",
  smile: "1f603",
} as const

type Reactions = typeof reactions

const getKeyByValue = (
  object: Reactions,
  value: string
): keyof Reactions | undefined => {
  return (Object.keys(object) as Array<keyof Reactions>).find(
    (key) => object[key] === value
  )
}
const RoomReactions = ({
  onClick: handleClick,
  latestRoomReaction,
}: RoomReactionProps) => {
  const [activeReactions, setActiveReactions] = useState(
    Object.keys(reactions).reduce(
      (acc, key) => {
        acc[key] = []
        return acc
      },
      {} as Record<string, string[]>
    )
  )

  const handleEmojiUpdate = (name: string) => {
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
  }

  // setActiveReactions if latestReaction changes
  useEffect(() => {
    if (!latestRoomReaction) return
    const emojiType = getKeyByValue(reactions, latestRoomReaction.type)
    if (!emojiType) {
      console.error("Emoji not found in reactions", latestRoomReaction.type)
      return
    }
    handleEmojiUpdate(emojiType)
  }, [latestRoomReaction])

  const handleAddReactionByUser = useCallback(
    (name: string) => {
      handleEmojiUpdate(name)
      handleClick({ type: reactions[name as keyof typeof reactions] })
        .then(() => {
          console.log("Reaction sent")
        })
        .catch((error) => {
          console.error("Error sending reaction", error)
        })
    },
    [handleClick]
  )

  return (
    <ol className="flex space-x-2">
      {Object.entries(reactions).map(([name, charCode]) => (
        <li key={name} className="relative" title="Coming Soon">
          <div className="h-0">
            {activeReactions[name]?.map((id) => (
              <FloatingReaction key={id} name={name} emoji={charCode} />
            ))}
          </div>
          <ReactionButton
            unified={charCode}
            onClick={() => handleAddReactionByUser(name)}
          />
        </li>
      ))}
    </ol>
  )
}

export default RoomReactions
