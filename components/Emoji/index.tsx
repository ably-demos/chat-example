import React from "react"
import { EmojiStyle, Emoji as ReactEmoji } from "emoji-picker-react"

type Props = Parameters<typeof ReactEmoji>[0]

const Emoji = ({ emojiStyle, ...props }: Props) => {
  return <ReactEmoji emojiStyle={emojiStyle ?? EmojiStyle.NATIVE} {...props} />
}

export default Emoji
