"use client"

import React, { useState } from "react"
import { Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Props = {
  onSend: (text: string) => void
}

const MessageInput = ({ onSend }: Props) => {
  const [text, setText] = useState("")
  const handleSend = (event: React.SyntheticEvent) => {
    event.preventDefault()
    if (!text) return
    onSend(text)
    setText("")
  }
  return (
    <form onSubmit={handleSend} className="flex w-full items-center space-x-2">
      <Input
        id="message"
        placeholder="Type your message..."
        className="flex-1"
        autoComplete="off"
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <Button type="submit" size="icon" disabled={text.length === 0}>
        <Send className="h-4 w-4" />
        <span className="sr-only">Send</span>
      </Button>
    </form>
  )
}

export default MessageInput
