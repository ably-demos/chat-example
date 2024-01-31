// import ReactEmojiPicker, { SkinTones, SuggestionMode } from "emoji-picker-react"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"

type EmojiPickerProps = { onSelect: (charCode: string) => void }

const EmojiPicker = ({ onSelect }: EmojiPickerProps) => {
  return <Picker data={data} onEmojiSelect={onSelect} />
}

export default EmojiPicker
