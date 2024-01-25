import { Chat, ConversationController as Conversation } from "@ably-labs/chat"
import { faker } from "@faker-js/faker"
import { Realtime, Types } from "ably/promises"
import dotenv, { config } from "dotenv"
import invariant from "tiny-invariant"

import { BotConfig, botConfig } from "@/config/bots"
import { generateMessage } from "@/lib/message"

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
  client: Realtime
): Promise<Bot> => {
  const clientId = faker.internet.userName({ firstName: usernamePrefix })

  return {
    clientId,
    tokenDetails: await client.auth.requestToken({
      clientId,
      capability: {
        [`conversations:${channelName}`]: ["publish", "subscribe", "presence"],
      },
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

const getTokenDetails = (
  { clientId }: Types.TokenParams,
  callback: AuthCallback,
  bots: Bot[]
) => {
  const bot = bots.find(({ clientId: botId }) => botId === clientId)

  if (!bot) {
    return callback(`No bot found, ${clientId}`, null)
  }

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

  const rootClient = new Realtime.Promise({
    key: process.env.ABLY_API_KEY,
    /**
     * @see https://ably.com/docs/auth/token?lang=javascript#auth-callback
     */
  })
  rootClient.close()

  const bots: Bot[] = await Promise.all(
    Array.from({ length: botCount }, () => generateBot(config, rootClient))
  )

  const client = new Realtime.Promise({
    authCallback: (tokenParams, cb) => getTokenDetails(tokenParams, cb, bots),
  })

  try {
    const chat = new Chat(client)
    const conversation = await getConversation(channelName, chat)
    // await createConversation(conversation)
    // await assertEmptyConversation(conversation)

    for (let i = 0; i < messageCount; i++) {
      const message = generateMessage()
      const bot = getRandomBot(bots)
      console.log("reandom bot", bot)
      console.log("Previous client id", client.clientId)
      console.log(`Sending message ${message} as ${bot.clientId}`)
      debugger
      await client.auth.authorize({ clientId: bot.clientId })
      // await sleep(2000)
      const result = await conversation.messages.send(message)
      console.log(result)
    }
  } catch (error) {
    console.error(error)
  }

  console.info("Closing client...")
  client.close()

  process.exit(0)
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

// destroy(botConfig)
// const getBotChats = async (
//   bots: string[],
//   channelName: string,
//   client: Realtime
// ) => {
//   return Promise.all(
//     bots.map(async (bot: string) => {
//       return new Chat(client)
//     })
//   )
// }
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
