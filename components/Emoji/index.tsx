import React from "react"
import { EmojiStyle, Emoji as ReactEmoji } from "emoji-picker-react"

type Props = Parameters<typeof ReactEmoji>[0] & {
  className?: string
}

const Emoji = ({ className, emojiStyle, ...props }: Props) => {
  return (
    <div className={className}>
      <ReactEmoji emojiStyle={emojiStyle ?? EmojiStyle.NATIVE} {...props} />
    </div>
  )
}

export default Emoji
