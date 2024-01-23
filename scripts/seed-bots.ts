import { Chat, ConversationController as Conversation } from "@ably-labs/chat"
import { faker, th } from "@faker-js/faker"
import { Realtime } from "ably/promises"
import dotenv from "dotenv"
import invariant from "tiny-invariant"

import { botConfig } from "@/config/bots"
import { generateMessage } from "@/lib/message"

dotenv.config()

// XXX:
// import { BOT_CHANNEL } from "@/hooks/useBotMessages"

invariant(process.env.ABLY_API_KEY, "ABLY_API_KEY is required")

const getConversation = async (conversationId: string, chat: Chat) => {
  const conversation = chat.conversations.get("bots")

  return conversation
}

const createConversation = async (conversation: Conversation) => {
  await conversation.create()
}

const generateUser = () => {
  return faker.internet.userName({ firstName: botConfig.botPrefix })
}

const assertEmptyConversation = async (conversation: Conversation) => {
  const messages = await conversation.messages.query({ limit: 1 })

  if (messages.length === 0) return

  throw new Error(
    "Conversation is not empty, bots already exist, try release the conversation first"
  )
}

const authoriseBots = async (bots: string[]) => {
  await Promise.all(
    bots.map((bot) => {
      const client = new Realtime.Promise({
        key: process.env.ABLY_API_KEY,
      })

      const chat = new Chat(client)
    })
  )
}

const main = async ({ botCount = 0, messageCount = 0 }) => {
  const client = new Realtime.Promise({
    key: process.env.ABLY_API_KEY,
  })

  const chat = new Chat(client)

  const conversation = await getConversation("bots", chat)

  await createConversation(conversation)

  await assertEmptyConversation(conversation)

  const bots = Array.from({ length: botCount }, generateUser)

  for (let i = 0; i < messageCount; i++) {
    await conversation.messages.send(generateMessage())
  }

  console.log(`Creating ${botCount} bots...`)
  console.log(bots)

  process.exit(0)
}

main(botConfig)
