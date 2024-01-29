import React from "react"
import clsx from "clsx"
import { SmileIcon } from "lucide-react"

import { Button, ButtonProps } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import ReactionPicker from "@/components/ReactionPicker"

type ReactionButtonProps = Omit<ButtonProps, "onSelect"> & {
  disabled?: boolean
  onSelect: (emoji: string) => void
}

export const isMobile = () => {
  const ua = navigator.userAgent
  return /Android|Mobi/i.test(ua)
}

export default React.memo(function ReactionButton({
  onSelect: handleSelect,
  disabled = false,
  className = "",
  ...props
}: ReactionButtonProps) {
  const popoverPositionProps = {
    alignOffset: -295,
    sideOffset: 15,
    align: "start" as const,
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="link"
          disabled={disabled}
          className={clsx(className, "px-2")}
          {...props}
        >
          <SmileIcon className="size-5 text-gray-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0" {...popoverPositionProps}>
        <ReactionPicker onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  )
})
