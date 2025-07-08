"use client"

import React, { forwardRef, useCallback, useEffect, useState } from "react"
import { Message, Messages } from "@ably/chat"

import MessageItem from "../MessageItem"
import Spinner from "../Spinner"
import styles from "./MessageList.module.css"

type MessageListProps = {
  loading: boolean
  messages: Message[]
  onUpdate: Messages["update"]
  onDelete: Messages["delete"]
  onScrollStateChange?: (isAtBottom: boolean) => void
}

const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  (
    { loading, messages, onDelete, onUpdate, onScrollStateChange },
    parentRef
  ) => {
    const [isAtBottom, setIsAtBottom] = useState(true)
    const [scrollNode, setScrollNode] = useState<HTMLDivElement | null>(null)

    const handleScrollableDivRef = useCallback(
      (node: HTMLDivElement | null) => {
        // Keep the node in state
        setScrollNode(node)
        if (typeof parentRef === "function") {
          parentRef(node)
        } else if (parentRef) {
          ;(
            parentRef as React.MutableRefObject<HTMLDivElement | null>
          ).current = node
        }
      },
      [parentRef]
    )

    // Attach the scroll listener once the node is available
    useEffect(() => {
      if (!scrollNode) return

      const handleScroll = () => {
        const { scrollHeight, scrollTop, clientHeight } = scrollNode
        const atBottom = scrollHeight - scrollTop <= clientHeight + 10
        setIsAtBottom(atBottom)
        if (onScrollStateChange) {
          onScrollStateChange(atBottom)
        }
      }

      scrollNode.addEventListener("scroll", handleScroll)
      return () => {
        scrollNode.removeEventListener("scroll", handleScroll)
      }
    }, [scrollNode, onScrollStateChange])

    // Auto-scroll to bottom if we’re already at bottom
    useEffect(() => {
      if (isAtBottom && scrollNode) {
        scrollNode.scrollTop = scrollNode.scrollHeight
      }
    }, [messages, isAtBottom, scrollNode])

    if (loading) return <Spinner />
    return (
      <div ref={handleScrollableDivRef} className={styles["MessageList"]}>
        <ol>
          {messages.map((message) => (
            <MessageItem
              key={message.serial}
              message={message}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </ol>
      </div>
    )
  }
)

MessageList.displayName = "MessageList"

export default MessageList
