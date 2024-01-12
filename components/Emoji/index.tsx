import React from "react"
import { Emoji as ReactEmoji } from "emoji-picker-react"

type Props = Parameters<typeof ReactEmoji>[0] & {
  className?: string
}

const Emoji = ({ className, ...props }: Props) => {
  return (
    <div className={className}>
      <ReactEmoji {...props} />
    </div>
  )
}

export default Emoji
