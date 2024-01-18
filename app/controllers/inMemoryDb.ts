import React from "react"
import { kv } from "@vercel/kv"
import { nanoid } from "nanoid"

export interface Conversation {
  id: string
  application_id: string
  ttl: number | null
  created_at: number
}

export interface Message {
  id: string
  client_id: string
  conversation_id: string
  content: string
  reactions: {
    counts: Record<string, number>
    latest: Reaction[]
    mine: Reaction[]
  }
  created_at: number
  updated_at: number | null
  deleted_at: number | null
}

export interface Reaction {
  id: string
  message_id: string
  conversation_id: string
  type: string
  client_id: string
  updated_at: number | null
  deleted_at: number | null
}

interface KVStore {
  conversations: Conversation[]
  conversationIdToMessages: Record<string, Message[]>
  reactions: Reaction[]
}

// const conversations: Conversation[] = []
// const conversationIdToMessages: Record<string, Message[]> = {}
// const reactions: Reaction[] = []
const getValueForKey = async <K extends keyof KVStore>(
  key: K
): Promise<KVStore[K]> => {
  const v: KVStore[K] = await kv.json.get(key)
  console.log(v)
  if (!v) throw new Error("Value not found")
  return v
}

export const createConversation = async (id: string): Promise<Conversation> => {
  const conversations = await getValueForKey("conversations")

  const existing = conversations.find((conv) => conv.id === id)
  if (existing) return existing
  const conversation = {
    id,
    application_id: process.env.APP_ID ?? "",
    ttl: null,
    created_at: Date.now(),
  }

  await kv.json.set("conversationIdToMessages", `$.${id}`, "[]")
  debugger
  await kv.json.arrappend("conversations", "$", JSON.stringify(conversation))
  debugger

  return conversation
}

createConversation("conversation1")

export const getConversation = async (id: string): Promise<Conversation> => {
  const conversations = await getValueForKey("conversations")
  const conversation = conversations.find((conv) => conv.id === id)
  if (!conversation) throw new Error()
  return conversation
}

export const findMessages = async (
  conversationId: string,
  clientId: string
) => {
  const messages = await kv.json.get(
    "conversationIdToMessages",
    `$.${conversationId}`
  )
  return enrichMessagesWithReactions(messages, clientId)
}

export const createMessage = async (
  message: Pick<Message, "client_id" | "conversation_id" | "content">
) => {
  const created: Message = {
    ...message,
    id: nanoid(),
    reactions: {
      counts: {},
      latest: [],
      mine: [],
    },
    created_at: Date.now(),
    updated_at: null,
    deleted_at: null,
  }

  await kv.json.arrappend(
    "conversationIdToMessages",
    `$.${created.conversation_id}`,
    JSON.stringify(created)
  )

  return created
}

export const editMessage = async (
  message: Pick<Message, "id" | "conversation_id" | "content">
) => {
  const messages: Message[] = await kv.json.get(
    "conversationIdToMessages",
    `$.${message.conversation_id}`
  )
  const edited = messages.find(({ id }) => message.id === id)

  if (!edited) throw new Error("Message not found")
  edited.content = message.content
  return edited
}

export const deleteMessage = async (
  message: Pick<Message, "id" | "conversation_id">
): Promise<Message> => {
  const messages: Message[] = await kv.json.get(
    "conversationIdToMessages",
    `$.${message.conversation_id}`
  )

  const deletedIndex = messages.findIndex(({ id }) => message.id === id)

  return (
    await kv.json.arrpop(
      "conversationIdToMessages",
      `$.${message.conversation_id}`,
      deletedIndex
    )
  )[0] as Message
}

export const addReaction = async (
  reaction: Pick<
    Reaction,
    "id" | "message_id" | "type" | "client_id" | "conversation_id"
  >
) => {
  const created: Reaction = {
    ...reaction,
    id: nanoid(),
    updated_at: null,
    deleted_at: null,
  }
  await kv.json.arrappend("reactions", "$", JSON.stringify(created))
  return created
}

export const deleteReaction = async (reactionId: string) => {
  const reactions: Reaction[] = await kv.json.get("reactions", "$")

  const deletedIndex = reactions.findIndex(
    (reaction) => reaction.id === reactionId
  )

  return (await kv.json.arrpop("reactions", "$", deletedIndex))[0] as Reaction
}

const enrichMessageWithReactions = async (
  message: Message,
  clientId: string
): Promise<Message> => {
  const reactions: Reaction[] = await kv.json.get("reactions", "$")
  try {
    const messageReactions = reactions.filter(
      (reaction) => reaction.message_id === message.id
    )
    const mine = messageReactions.filter(
      (reaction) => reaction.client_id === clientId
    )
    const counts = messageReactions.reduce(
      (acc, reaction) => {
        if (acc[reaction.type]) {
          acc[reaction.type]++
        } else {
          acc[reaction.type] = 1
        }
        return acc
      },
      {} as Record<string, number>
    )
    return {
      ...message,
      reactions: {
        counts,
        latest: messageReactions,
        mine,
      },
    }
  } catch (e) {
    console.log(e)
    return {
      ...message,
      reactions: {
        counts: {},
        latest: [],
        mine: [],
      },
    }
  }
}

const enrichMessagesWithReactions = async (
  messages: Message[],
  clientId: string
) => {
  const promises = (messages ?? []).map(async (message) => {
    try {
      const msg = await enrichMessageWithReactions(message, clientId)
      return msg
    } catch (e) {
      console.log(e)
      return message
    }
  })

  return Promise.all(promises)
}
