"use client"

import React, { forwardRef } from "react"
import { Message } from "@ably/chat"

import MessageItem from "../MessageItem"
import Spinner from "../Spinner"
import styles from "./MessageList.module.css"

type MessageListProps = {
  loading: boolean
  messages: Message[]
}

const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ loading, messages }, ref) => {
    if (loading) return <Spinner />
    return (
      <div ref={ref} className={styles["MessageList"]}>
        <ol>
          {messages.map((message) => (
            <MessageItem key={message.serial} message={message} />
          ))}
        </ol>
      </div>
    )
  }
)

MessageList.displayName = "MessageList"

export default MessageList
