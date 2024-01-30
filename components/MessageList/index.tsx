"use client"

import React, { CSSProperties, useMemo, useRef } from "react"
import { Message } from "@ably-labs/chat"
import AutoSizer from "react-virtualized-auto-sizer"
import { VariableSizeList } from "react-window"

import MessageItem, { MessageItemProps } from "../MessageItem"
import Spinner from "../Spinner"

type MessageListProps = {
  username: string
  loading: boolean
  messages: Message[]
  onEdit: (messageId: string, content: string) => void
  onDelete: (messageId: string) => void
  onAddReaction: (messageId: string, reaction: string) => void
  onRemoveReaction: (messageId: string, reactionId: string) => void
}

const MessageList = ({
  username,
  loading,
  messages,
  onEdit,
  onDelete,
  onAddReaction,
  onRemoveReaction,
}: MessageListProps) => {
  const messageListRef = useRef<VariableSizeList<Message[]>>(null)

  const itemData = useMemo(
    () => ({
      messages,
      onEdit,
      onDelete,
      onAddReaction,
      onRemoveReaction,
    }),
    [messages, onAddReaction, onDelete, onEdit, onRemoveReaction]
  )
  if (loading) return <Spinner />

  return (
    <AutoSizer>
      {({ height, width }) => (
        <VariableSizeList
          itemData={itemData}
          itemSize={(index) => getItemSize(messages[index], width)}
          itemCount={messages.length}
          itemKey={(index) => messages[index].id}
          height={height}
          width={width}
          ref={messageListRef}
          outerElementType={"ol"}
        >
          {MessageRow}
        </VariableSizeList>
      )}
    </AutoSizer>
  )
}
const MessageRow = ({
  data: {
    username,
    message,
    onEdit,
    onDelete,
    onAddReaction,
    onRemoveReaction,
  },
  style,
  index,
}: {
  data: MessageItemProps
  style: CSSProperties
  index: number
}) => (
  <MessageItem
    username={username}
    message={messages[index]}
    style={style}
    onEdit={onEdit}
    onDelete={onDelete}
    onAddReaction={onAddReaction}
    onRemoveReaction={onRemoveReaction}
  />
)

/* Needs some work doesn't take into account glyph width */
const getItemSize = (message: Message, width: number) => {
  return (
    Math.ceil(
      (message.created_by.length + 2 /* Space */ + message.content.length) /
        width
    ) *
      24 /* Line height */ +
    8 /* Y padding */
  )
}

export default MessageList
