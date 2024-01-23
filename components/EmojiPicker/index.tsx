import ReactEmojiPicker, {
  Theme as EmojiPickerTheme,
  EmojiStyle,
  SkinTones,
  SuggestionMode,
} from "emoji-picker-react"

import { useTheme } from "@/hooks/useTheme"
import { Theme } from "@/components/ThemeProvider"

type EmojiPickerProps = { onSelect: (charCode: string) => void }

const EmojiPicker = ({ onSelect }: EmojiPickerProps) => {
  const { theme } = useTheme() ?? Theme.System

  return (
    <ReactEmojiPicker
      defaultSkinTone={SkinTones.NEUTRAL}
      onEmojiClick={({ unified: charCode, ...rest }) => onSelect(charCode)}
      skinTonesDisabled
      lazyLoadEmojis
      suggestedEmojisMode={SuggestionMode.RECENT}
      width={"350px"}
    />
  )
}

export default EmojiPicker
