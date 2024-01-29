import React from "react"

import { Button } from "@/components/ui/button"
import Reaction from "@/components/Reaction"

type ReactionProps = {
  onClick: (emoji: string) => void
  unified: string
}
const ReactionButton = ({ onClick, unified }: ReactionProps) => {
  return (
    <Button
      onClick={() => onClick(unified)}
      className="size-[34px] rounded-full bg-reaction hover:bg-reaction"
    >
      <Reaction size={18} unified={unified} />
    </Button>
  )
}

export default ReactionButton
