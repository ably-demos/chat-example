"use client"

import React, { forwardRef } from "react"
import { Message } from "@ably/chat"

import MessageItem from "../MessageItem"
import Spinner from "../Spinner"
import styles from "./MessageList.module.css"

type MessageListProps = {
  username: string
  loading: boolean
  messages: Message[]
}

const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ username, loading, messages }, ref) => {
    if (loading) return <Spinner />
    return (
      <div ref={ref} className={styles["MessageList"]}>
        <ol>
          {messages.map((message) => (
            <MessageItem key={message.timeserial} message={message} />
          ))}
        </ol>
      </div>
    )
  }
)

MessageList.displayName = "MessageList"

export default MessageList
