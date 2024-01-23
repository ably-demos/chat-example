import React from "react"

import { Button, ButtonProps } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Emoji from "@/components/Emoji"
import EmojiPicker from "@/components/EmojiPicker"
import { SmileIcon } from "lucide-react"
import clsx from "clsx"

type EmojiButtonProps = Omit<ButtonProps, "onSelect"> & {
  disabled?: boolean
  onSelect: (emoji: string) => void
}

export const isMobile = () => {
  const ua = navigator.userAgent
  return /Android|Mobi/i.test(ua)
}

export default React.memo(function EmojiButton({
  onSelect: handleSelect,
  disabled = false,
  className = "",
  ...props
}: EmojiButtonProps) {

  
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
          className={clsx(className, "px-2" )}
          {...props}
        >
          <SmileIcon className="size-5 text-gray-400"/>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0" {...popoverPositionProps} >
        <EmojiPicker onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  )
})
