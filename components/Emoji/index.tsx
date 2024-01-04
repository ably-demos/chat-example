import React from "react"
import { Emoji as ReactEmoji } from "emoji-picker-react"

type Props = Parameters<typeof ReactEmoji>[0]

const Emoji = (props: Props) => {
  return <ReactEmoji {...props} />
}

export default Emoji
