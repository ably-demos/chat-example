import React from "react"
import { EmojiStyle } from "emoji-picker-react"

import Emoji from "@/components/Emoji"

import { Button } from "../ui/button"

type ReactionProps = {
  onClick: (emoji: string) => void
  unified: string
}
const Reaction = ({ onClick, unified }: ReactionProps) => {
  return (
    <Button
      variant="ghost"
      onClick={() => onClick(unified)}
      className="h-11 w-11 rounded-full transition-colors duration-150"
    >
      <Emoji size={24} emojiStyle={EmojiStyle.NATIVE} unified={unified} />
    </Button>
  )
}

export default Reaction
