import React, { useCallback, useEffect } from "react"
import {
  ConversationController as Conversation,
  Message,
  ReactionEvents,
  ReactionListener,
} from "@ably-labs/chat"

import { mapFromDelete, mapFromUpdate } from "@/lib/reaction"

import { useMessages } from "./useMessages"

/**
 *
 * @description Listen to Reaction events on the given conversation, and run the callback function when the event is triggered
 * @param conversation Conversation object from Ably Chat SDK
 * @param eventName  Name of the Reaction event to subscribe to
 * @param cb The callback function to run when the event is fired
 *
 * @example
 * useReactionEvent(conversation, ReactionEvents.created, ({ reaction }) => {
 *   console.log(reaction)
 * })
 */
export const useReactionEvent = (
  conversation: Conversation,
  eventName: ReactionEvents,
  cb: ReactionListener
) => {
  conversation.messages.subscribeReactions(eventName, cb)
  useEffect(() => {
    return () => {
      conversation.messages.unsubscribeReactions(eventName, cb)
    }
  }, [conversation.messages, cb, eventName])
}

/**
 * @description This hook will add bot messages to the message list, and handle the bot reactions
 * @param username This will be the client_id - user id - on the message. It should likely be the unique username/id for the user in your system
 * @returns The messages for the current conversation, and methods to send, edit, delete, add and remove reactions
 *
 * @example
 * const {
 *   messages,
 *   loading,
 *   sendMessage,
 *   editMessage,
 *   deleteMessage,
 * } = useMessages(username)
 *
 */
export const useReactions = (conversation: Conversation, username: string) => {
  const { setMessages } = useMessages(conversation)

  const { addReaction, removeReaction } = conversation.messages

  const handleReactionAdd: ReactionListener = useCallback(
    ({ reaction }) => {
      setMessages((prevMessage: Message[]) =>
        prevMessage.map((message) => mapFromUpdate(username, message, reaction))
      )
    },
    [setMessages, username]
  )

  const handleReactionDelete: ReactionListener = useCallback(
    ({ reaction }) => {
      setMessages((prevMessages: Message[]) =>
        prevMessages.map((message) =>
          mapFromDelete(username, message, reaction)
        )
      )
    },
    [setMessages, username]
  )

  useReactionEvent(conversation, ReactionEvents.added, handleReactionAdd)
  useReactionEvent(conversation, ReactionEvents.deleted, handleReactionAdd)

  return {
    addReaction,
    removeReaction,
    handleReactionAdd,
    handleReactionDelete,
  }
}
