import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"

type ReactionPickerProps = { onSelect: (charCode: string) => void }

const ReactionPicker = ({ onSelect }: ReactionPickerProps) => {
  return (
    <Picker
      data={data}
      theme="light"
      onEmojiSelect={({ unified }: { unified: string }) => onSelect(unified)}
    />
  )
}

export default ReactionPicker
