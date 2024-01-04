import React from "react"
import { EmojiStyle } from "emoji-picker-react"

import Emoji from "../Emoji"

type RoomReactionProps = {}

const reactions = {
  smile: () => (
    <Emoji size={18} emojiStyle={EmojiStyle.NATIVE} unified="1f603" />
  ),
  hushed: () => (
    <Emoji size={18} emojiStyle={EmojiStyle.NATIVE} unified="1f62f" />
  ),
  thumbsUp: () => (
    <Emoji size={18} emojiStyle={EmojiStyle.NATIVE} unified="1f44d" />
  ),
  redHeart: () => (
    <Emoji size={18} emojiStyle={EmojiStyle.NATIVE} unified="2764-fe0f" />
  ),
}

const RoomReactions = (props: RoomReactionProps) => {
  return (
    <div className="flex">
      {Object.entries(reactions).map(([name, EmojiComp]) => {
        return (
          <button key={name} className="p-2">
            <EmojiComp />
          </button>
        )
      })}
    </div>
  )
}

export default RoomReactions
