import React from "react"

import { Button } from "@/components/ui/button"
import Emoji from "@/components/Emoji"

type ReactionProps = {
  onClick: (emoji: string) => void
  unified: string
}
const Reaction = ({ onClick, unified }: ReactionProps) => {
  return (
    <Button
      onClick={() => onClick(unified)}
      className="size-[34px] rounded-full bg-reaction hover:bg-reaction"
    >
      <Emoji size={18} unified={unified} />
    </Button>
  )
}

export default Reaction
