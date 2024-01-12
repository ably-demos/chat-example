import React from "react"
import { Emoji as ReactEmoji } from "emoji-picker-react"

type Props = Parameters<typeof ReactEmoji>[0]

const Emoji = (props: Props) => {
  return (
    <div>
      <ReactEmoji {...props} />
    </div>
  )
}

export default Emoji
