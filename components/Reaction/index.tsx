import React from "react"
import { Emoji } from "emoji-picker-react"

type Props = Parameters<typeof Emoji>[0]

const Reaction = ({ ...props }: Props) => {
  return <Emoji {...props} />
}

export default Reaction
