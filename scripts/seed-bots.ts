import { Chat } from "@ably-labs/chat"
import { faker, th } from "@faker-js/faker"
import { Realtime } from "ably/promises"
import dotenv from "dotenv"
import invariant from "tiny-invariant"

import { botConfig } from "@/config/bots"

dotenv.config()

// XXX:
// import { BOT_CHANNEL } from "@/hooks/useBotMessages"

invariant(process.env.ABLY_API_KEY, "ABLY_API_KEY is required")

const client = new Realtime.Promise({
  key: process.env.ABLY_API_KEY,
})

const chat = new Chat(client)

const conversation = chat.conversations.get("bots")

const createChannel = async () => {
  await conversation.create()
}

const generateUser = () => {
  return faker.internet.userName({ firstName: botConfig.botPrefix })
}

const assertEmptyConversation = async () => {
  const messages = await conversation.messages.query({ limit: 1 })

  if (messages.length === 0) return

  throw new Error(
    "Conversation is not empty, bots already exist, try release the conversation first"
  )
}

// const generateRandomMessage = () => {
//   return faker.lorem.sentence()
// }

const main = async (botCount = 0) => {
  await createChannel()

  await assertEmptyConversation()

  const bots = Array.from({ length: botCount }, generateUser)

  console.log(`Creating ${botCount} bots...`)
  console.log(bots)

  process.exit(0)
}

main(botConfig.botCount)
