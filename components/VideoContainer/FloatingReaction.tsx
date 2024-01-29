import React from "react"

import Reaction from "../Reaction"

type Props = {
  name: string
  emoji: string
}

const FloatingReaction = ({ name, emoji }: Props) => {
  return (
    <div className={`FloatingReaction`}>
      <Reaction size={24} unified={emoji} />
    </div>
  )
}

export default FloatingReaction
