import { get } from "http"
import React, { useEffect } from "react"
import { set } from "date-fns"
import EmojiPicker, {
  Theme as EmojiPickerTheme,
  EmojiStyle,
  SkinTones,
  SuggestionMode,
} from "emoji-picker-react"
import { Laugh } from "lucide-react"

import { useTheme } from "@/hooks/useTheme"
import { Button } from "@/components/ui/button"

import { Theme } from "../ThemeProvider"

type EmojiButtonProps = {
  disabled?: boolean
}

const getEmojiPickerTheme = (theme: Theme | undefined): EmojiPickerTheme => {
  switch (theme) {
    case Theme.Light:
      return EmojiPickerTheme.LIGHT
    case Theme.Dark:
      return EmojiPickerTheme.DARK
    default:
      return EmojiPickerTheme.AUTO
  }
}

const EmojiButton = ({ disabled = false }: EmojiButtonProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const { theme } = useTheme() ?? Theme.System

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      console.trace("User pressed: ", event.key)

      if (event.key === "Escape") {
        event.preventDefault()
        setIsOpen(false)
      }
    }

    document.addEventListener("keydown", keyDownHandler)

    return () => {
      document.removeEventListener("keydown", keyDownHandler)
    }
  }, [])

  return (
    <>
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Laugh className="h-5 w-5" />
      </Button>
      <div className="relative">
        {isOpen ? (
          <EmojiPicker
            theme={getEmojiPickerTheme(theme)}
            defaultSkinTone={SkinTones.NEUTRAL}
            emojiStyle={EmojiStyle.NATIVE}
            lazyLoadEmojis={true}
            skinTonesDisabled
            suggestedEmojisMode={SuggestionMode.RECENT}
            className="min-w-[300px] max-w-[400px]"
          />
        ) : null}
      </div>
    </>
  )
}

export default EmojiButton
