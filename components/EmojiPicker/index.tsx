import ReactEmojiPicker, {
  Theme as EmojiPickerTheme,
  EmojiStyle,
  SkinTones,
  SuggestionMode,
} from "emoji-picker-react"

import { useTheme } from "@/hooks/useTheme"
import { Theme } from "@/components/ThemeProvider"

import "./styles.css"

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

type EmojiPickerProps = { onSelect: (charCode: string) => void }

const EmojiPicker = ({ onSelect }: EmojiPickerProps) => {
  const { theme } = useTheme() ?? Theme.System

  return (
    <ReactEmojiPicker
      defaultSkinTone={SkinTones.NEUTRAL}
      emojiStyle={EmojiStyle.NATIVE}
      onEmojiClick={({ unifiedWithoutSkinTone: charCode }) =>
        onSelect(charCode)
      }
      skinTonesDisabled
      suggestedEmojisMode={SuggestionMode.RECENT}
      theme={getEmojiPickerTheme(theme)}
      width={"350px"}
    />
  )
}

export default EmojiPicker
