import ReactReactionPicker, {
  SkinTones,
  SuggestionMode,
} from "emoji-picker-react"

type ReactionPickerProps = { onSelect: (charCode: string) => void }

const ReactionPicker = ({ onSelect }: ReactionPickerProps) => {
  return (
    <ReactReactionPicker
      defaultSkinTone={SkinTones.NEUTRAL}
      onEmojiClick={({ unifiedWithoutSkinTone: charCode }) =>
        onSelect(charCode)
      }
      skinTonesDisabled
      width={"350px"}
    />
  )
}

export default ReactionPicker
