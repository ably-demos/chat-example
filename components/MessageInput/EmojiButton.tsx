import React, { useState } from "react"
import { Emoji, EmojiStyle } from "emoji-picker-react"

import { Button, ButtonProps } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import EmojiPicker from "./EmojiPicker"

type EmojiButtonProps = {
  disabled?: boolean
  onClick?: (cb?: (open: boolean) => void) => void
} & ButtonProps

const EmojiButton = ({
  disabled = false,
  onClick = () => {},
  ...props
}: EmojiButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          disabled={disabled}
          className="w-10"
          onClick={() => setIsOpen((prev) => !prev)}
          {...props}
        >
          <Emoji unified="1f604" emojiStyle={EmojiStyle.NATIVE} size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0">
        <EmojiPicker onCloseEvent={() => setIsOpen(false)} />
      </PopoverContent>
    </Popover>
  )
}

export default EmojiButton
