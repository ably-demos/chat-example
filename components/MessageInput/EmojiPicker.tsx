import { useEffect } from "react"
import ReactEmojiPicker, {
  Theme as EmojiPickerTheme,
  EmojiStyle,
  SkinTones,
  SuggestionMode,
} from "emoji-picker-react"

import { useTheme } from "@/hooks/useTheme"

import { Theme } from "../../providers/ThemeProvider"

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

type EmojiPickerProps = { onCloseEvent: () => void }

const EmojiPicker = ({ onCloseEvent }: EmojiPickerProps) => {
  const { theme } = useTheme() ?? Theme.System

  return (
    <ReactEmojiPicker
      theme={getEmojiPickerTheme(theme)}
      defaultSkinTone={SkinTones.NEUTRAL}
      emojiStyle={EmojiStyle.NATIVE}
      skinTonesDisabled
      width={"350px"}
      suggestedEmojisMode={SuggestionMode.RECENT}
    />
  )
}

export default EmojiPicker
