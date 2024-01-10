import React from "react"
import { Emoji, EmojiStyle } from "emoji-picker-react"

import { cn } from "@/lib/utils"
import { useWindowSize, WindowSize } from "@/hooks/useWindowSize"
import { Button, ButtonProps } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import EmojiPicker from "./EmojiPicker"

type EmojiButtonProps = {
  disabled?: boolean
  onSelect: (emoji: string) => void
} & ButtonProps

export const isMobile = () => {
  const ua = navigator.userAgent
  return /Android|Mobi/i.test(ua)
}

const isLargeScreen = (size: WindowSize) => {
  if (!size.width) return null
  return size.width > 768
}

export default React.memo(function EmojiButton({
  onSelect: handleSelect,
  disabled = false,
  className = "",
  ...props
}: EmojiButtonProps) {
  console.log("EmojiButton rerender")
  const windowSize = useWindowSize()

  const hidden = isMobile()

  const popoverPositionProps = {
    alignOffset: isLargeScreen(windowSize) ? -400 : undefined,
    sideOffset: isLargeScreen(windowSize) ? -36 : 80,
    align: "start" as const,
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          disabled={disabled}
          className={cn(className, "pl-4 pr-5", hidden && "hidden")}
          {...props}
        >
          <Emoji unified="1f604" emojiStyle={EmojiStyle.NATIVE} size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0" {...popoverPositionProps}>
        <EmojiPicker onSelect={() => {}} />
      </PopoverContent>
    </Popover>
  )
})
