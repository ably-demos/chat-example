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
      className="rounded-full px-[6px] pb-[1px] pt-[3px] transition-colors duration-150 hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      <Emoji size={22} emojiStyle={EmojiStyle.NATIVE} unified={unified} />
    </Button>
  )
}

export default Reaction
