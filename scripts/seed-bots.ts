import { Chat, ConversationController as Conversation } from "@ably-labs/chat"
import { faker } from "@faker-js/faker"
import { Realtime, Rest, Types } from "ably/promises"
import dotenv, { config } from "dotenv"
import invariant from "tiny-invariant"

import { BotConfig, botConfig } from "@/config/bots"
import { generateMessage } from "@/lib/bot"

dotenv.config()

invariant(process.env.ABLY_API_KEY, "ABLY_API_KEY is required")

const getConversation = async (conversationId: string, chat: Chat) => {
  const conversation = chat.conversations.get(conversationId)

  return conversation
}

const createConversation = async (conversation: Conversation) => {
  console.info("Creating conversation...")
  await conversation.create()
}

const assertEmptyConversation = async (conversation: Conversation) => {
  console.info("Asserting conversation is empty...")
  const messages = await conversation.messages.query({ limit: 1 })
  console.debug("messages", messages)
  if (messages.length === 0) return

  throw new Error(
    "Conversation is not empty, bots already exist, try release the conversation first"
  )
}

const generateBot = async (
  { usernamePrefix, channelName }: BotConfig,
  client: Rest
): Promise<Bot> => {
  const clientId = faker.internet.userName({ firstName: usernamePrefix })

  return {
    clientId,
    tokenDetails: await client.auth.requestToken({
      clientId,
    }),
  }
}

type Bot = {
  clientId: string
  tokenDetails: Types.TokenDetails
}

type AuthCallback = Parameters<Required<Types.AuthOptions>["authCallback"]>[1]
type AuthCallbackError = Parameters<AuthCallback>[0]

const getRandomBot = (bots: Bot[]) => {
  const randomIndex = Math.floor(Math.random() * bots.length)
  return bots[randomIndex]
}

const getTokenDetails = (callback: AuthCallback, bots: Bot[]) => {
  const bot = getRandomBot(bots)
  console.log("Using token details for ", bot.clientId)

  try {
    callback(null, bot.tokenDetails)
  } catch (error) {
    callback(error as AuthCallbackError, null)
  }
}

// TODO: There be dragons here, also this is not working
const main = async (config: BotConfig) => {
  const { channelName, botCount, messageCount } = config
  console.debug(
    `Seeding ${channelName} with ${messageCount} messages from ${botCount} bots...`
  )

  const rootClient = new Rest.Promise({
    key: process.env.ABLY_API_KEY,
    restHost: "eu-west-2-a.primary.chat.cluster.ably-nonprod.net",
    realtimeHost: "eu-west-2-a.primary.chat.cluster.ably-nonprod.net",
  })

  const bots: Bot[] = await Promise.all(
    Array.from({ length: botCount }, () => generateBot(config, rootClient))
  )

  try {
    // await createConversation(conversation)
    // await assertEmptyConversation(conversation)

    for (let i = 0; i < messageCount; i++) {
      const bot = getRandomBot(bots)
      sendMessage(bots, channelName)
      console.info(`Sent message ${i + 1} of ${messageCount}`)
      await sleep(1000)
    }
  } catch (error) {
    console.error(error)
    throw new Error("Failed to seed bots")
  }

  console.info("Closing client...")

  process.exit(0)
}

const sendMessage = async (bots: Bot[], channelName: string) => {
  let client: Realtime
  try {
    const client = new Realtime({
      restHost: "eu-west-2-a.primary.chat.cluster.ably-nonprod.net",
      realtimeHost: "eu-west-2-a.primary.chat.cluster.ably-nonprod.net",
      /**
       * @see https://ably.com/docs/auth/token?lang=javascript#auth-callback
       */
      authCallback: (_, callback) => getTokenDetails(callback, bots),
    })
    const chat = new Chat(client)
    const conversation = await getConversation(channelName, chat)
    const message = generateMessage()

    console.log("Sending message", message)
    return conversation.messages
      .send(message)
      .finally(() => chat.connection.close())
  } catch (error) {
    console.error(error)
  }
}

main(botConfig)

const destroy = async (config: BotConfig) => {
  const { channelName } = config
  console.debug(`Destroying ${channelName}...`)

  let client: Realtime | undefined
  try {
    const client = new Realtime.Promise({
      key: process.env.ABLY_API_KEY,
    })

    const chat = new Chat(client)

    const conversation = await getConversation(channelName, chat)
    await conversation.delete()
  } catch (error) {
    console.error(error)
  }

  console.info("Closing client...")
  client?.close()

  process.exit(0)
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
