import React from "react"
import { Emoji } from "emoji-picker-react"

type Props = {
  name: string
  emoji: string
}

const FloatingReaction = ({ name, emoji }: Props) => {
  return (
    <div className={`FloatingReaction`}>
      <Emoji size={24} unified={emoji} />
    </div>
  )
}

export default FloatingReaction
