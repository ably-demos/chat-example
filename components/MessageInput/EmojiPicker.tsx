import { useEffect } from "react"
import ReactEmojiPicker, {
  Theme as EmojiPickerTheme,
  EmojiStyle,
  SkinTones,
  SuggestionMode,
} from "emoji-picker-react"

import { useTheme } from "@/hooks/useTheme"

import { Theme } from "../ThemeProvider"

import "./emoji-picker-styles.css"

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

type EmojiPickerProps = { open: boolean; onCloseEvent: () => void }

const EmojiPicker = ({ open, onCloseEvent }: EmojiPickerProps) => {
  const { theme } = useTheme() ?? Theme.System

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      console.trace("User pressed: ", event.key)

      if (event.key === "Escape") {
        event.preventDefault()
        onCloseEvent()
      }
    }

    document.addEventListener("keydown", keyDownHandler)

    return () => {
      document.removeEventListener("keydown", keyDownHandler)
    }
  }, [onCloseEvent])

  if (!open) return null
  return (
    <ReactEmojiPicker
      className="w-96"
      theme={getEmojiPickerTheme(theme)}
      defaultSkinTone={SkinTones.NEUTRAL}
      emojiStyle={EmojiStyle.NATIVE}
      //   lazyLoadEmojis={true}
      skinTonesDisabled
      //   width={"3px"}
      suggestedEmojisMode={SuggestionMode.RECENT}
    />
  )
}

export default EmojiPicker
