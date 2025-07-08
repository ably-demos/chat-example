"use client"

import { useEffect, useRef } from "react"
import { ChatClient } from "@ably/chat"
import { faker } from "@faker-js/faker"
import * as Ably from "ably"

import { generateMessage } from "@/lib/bot"

interface BotResource {
  client: Ably.Realtime
  chatClient: ChatClient
  clientId: string
}

const generateBot = () => faker.internet.userName()

const BOTS_ENABLED = process.env.NEXT_PUBLIC_WITH_BOTS === "true"
// How often the bot will send a message in milliseconds
const rawInterval = parseInt(
  process.env.NEXT_PUBLIC_BOT_INTERVAL ?? "60000",
  10
)
const BOT_INTERVAL =
  Number.isNaN(rawInterval) || rawInterval <= 0 ? 60000 : rawInterval

const rawCount = parseInt(process.env.NEXT_PUBLIC_BOT_COUNT ?? "100", 10)
const BOT_COUNT = Number.isNaN(rawCount) || rawCount <= 0 ? 100 : rawCount

const rawProbability = parseFloat(
  process.env.NEXT_PUBLIC_BOT_PUBLISHER_PROBABILITY ?? "1"
)
const BOT_PUBLISHER_PROBABILITY =
  Number.isNaN(rawProbability) || rawProbability <= 0 ? 1 : rawProbability

/**
 * Custom hook to spawn bots in the chat room.
 * @param {string} roomName - The name of the room to spawn bots in.
 */
export const useBots = (roomName: string | undefined) => {
  const currentBotsRef = useRef<number>(0)
  const botResourcesRef = useRef<BotResource[]>([])
  const timeoutsRef = useRef<NodeJS.Timeout[]>([])

  useEffect(() => {
    if (!BOTS_ENABLED || !roomName || currentBotsRef.current >= BOT_COUNT)
      return

    const initializeBot = async () => {
      // Generate a unique bot username
      const clientId = generateBot()

      // Create an Ably Realtime client for the bot
      const client = new Ably.Realtime({
        authUrl: `/api/auth?clientId=${clientId}`,
        clientId,
      })

      // Create a chat client and join the room
      const chatClient = new ChatClient(client)
      const room = await chatClient.rooms.get(roomName)
      await room.attach()

      const botResource: BotResource = {
        client,
        chatClient,
        clientId,
      }

      botResourcesRef.current.push(botResource)
      currentBotsRef.current += 1

      console.debug(
        `Bot ${clientId} joined room ${roomName} (${currentBotsRef.current}/${BOT_COUNT})`
      )

      // Randomly determine if this bot will send messages based on probability
      if (Math.random() > BOT_PUBLISHER_PROBABILITY) return

      // Function to send messages at random intervals
      const sendMessageWithRandomInterval = async () => {
        try {
          await room.messages.send({ text: generateMessage() })
          console.log(
            `Bot ${botResource.clientId} sent message in room ${roomName}`
          )
        } catch (error) {
          console.error(
            `Error sending message in room ${roomName} for bot ${botResource.clientId}`,
            error
          )
        }

        // Calculate a random interval for the next message (between 10s and BOT_INTERVAL)
        const randomInterval =
          Math.floor(Math.random() * (BOT_INTERVAL - 10000)) + 10000

        // Schedule the next message and track the timeout
        const timeoutId = setTimeout(
          sendMessageWithRandomInterval,
          randomInterval
        )
        timeoutsRef.current.push(timeoutId)
      }

      // Start sending messages at random intervals
      sendMessageWithRandomInterval()
    }

    const initializeBots = () => {
      // Recursive function to create bots one by one with a delay
      const createBotWithDelay = (index: number) => {
        if (index >= BOT_COUNT || currentBotsRef.current >= BOT_COUNT) return
        const timeoutId = setTimeout(async () => {
          try {
            await initializeBot()
            console.debug(`Bot ${index + 1} initialized`)
          } catch (error) {
            console.error(`Error initializing bot ${index + 1}:`, error)
          }
          createBotWithDelay(index + 1)
        }, 500)
        timeoutsRef.current.push(timeoutId)
      }
      createBotWithDelay(currentBotsRef.current)
    }

    initializeBots()
    return () => {
      // Clear all scheduled timeouts to prevent them from running after unmount
      timeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId))
      timeoutsRef.current = []

      const cleanupBotResources = async () => {
        for (const resource of botResourcesRef.current) {
          try {
            await resource.chatClient.rooms.release(roomName)
          } catch (error) {
            console.error(
              `Error releasing room ${roomName} for bot ${resource.clientId}`,
              error
            )
          }
          resource.client.close()
        }
        botResourcesRef.current = []
        currentBotsRef.current = 0

        console.debug(`Cleaned up all bots for room ${roomName}`)
      }

      cleanupBotResources()
    }
  }, [roomName])
}
