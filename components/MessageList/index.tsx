"use client"

import React, { CSSProperties, memo, useMemo, useRef } from "react"
import { Message } from "@ably-labs/chat"
import AutoSizer from "react-virtualized-auto-sizer"
import { areEqual, VariableSizeList } from "react-window"

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
  const itemData = useMemo(
    () => ({
      username,
      messages,
      onEdit,
      onDelete,
      onAddReaction,
      onRemoveReaction,
    }),
    [messages, onAddReaction, onDelete, onEdit, onRemoveReaction, username]
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
          outerElementType={"ol"}
        >
          {MessageRow}
        </VariableSizeList>
      )}
    </AutoSizer>
  )
}

const MessageRow = memo(function MessageRowInner({
  data: {
    username,
    messages,
    onEdit,
    onDelete,
    onAddReaction,
    onRemoveReaction,
  },
  style,
  index,
}: {
  data: { messages: Message[] } & Omit<MessageItemProps, "message" | "style">
  style: CSSProperties
  index: number
}) {
  return (
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
}, areEqual)

/* Needs some work, assumes monospaced glyphs */
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
