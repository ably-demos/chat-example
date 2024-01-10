import ReactEmojiPicker, {
  Theme as EmojiPickerTheme,
  EmojiStyle,
  SkinTones,
  SuggestionMode,
} from "emoji-picker-react"

import { useTheme } from "@/hooks/useTheme"
import { Theme } from "@/components/ThemeProvider"

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

type EmojiPickerProps = { onSelect: (emoji: string) => void }

const EmojiPicker = ({ onSelect }: EmojiPickerProps) => {
  const { theme } = useTheme() ?? Theme.System

  return (
    <ReactEmojiPicker
      theme={getEmojiPickerTheme(theme)}
      defaultSkinTone={SkinTones.NEUTRAL}
      emojiStyle={EmojiStyle.NATIVE}
      skinTonesDisabled
      width={"350px"}
      onEmojiClick={(emoji) => onSelect(emoji.unifiedWithoutSkinTone)}
      suggestedEmojisMode={SuggestionMode.RECENT}
    />
  )
}

export default EmojiPicker
