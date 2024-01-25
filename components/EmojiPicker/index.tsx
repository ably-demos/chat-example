import ReactEmojiPicker, { SkinTones, SuggestionMode } from "emoji-picker-react"

type EmojiPickerProps = { onSelect: (charCode: string) => void }

const EmojiPicker = ({ onSelect }: EmojiPickerProps) => {
  return (
    <ReactEmojiPicker
      defaultSkinTone={SkinTones.NEUTRAL}
      onEmojiClick={({ unified: charCode, ...rest }) => onSelect(charCode)}
      skinTonesDisabled
      suggestedEmojisMode={SuggestionMode.RECENT}
      width={"350px"}
    />
  )
}

export default EmojiPicker
