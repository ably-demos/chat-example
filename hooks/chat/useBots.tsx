"use client"

import { useEffect, useState } from "react"
import { ChatClient } from "@ably/chat"
import { faker } from "@faker-js/faker"
import * as Ably from "ably"

import { generateMessage } from "@/lib/bot"

const generateBot = () => faker.internet.userName()

const BOTS_ENABLED = process.env.NEXT_PUBLIC_WITH_BOTS === "true"
// How often the bot will send a message in milliseconds
const rawInterval = parseInt(process.env.NEXT_PUBLIC_BOT_INTERVAL ?? "60000", 10);
const BOT_INTERVAL = Math.max(10000, Number.isNaN(rawInterval) || rawInterval < 0 ? 60000 : rawInterval);

const rawCount = parseInt(process.env.NEXT_PUBLIC_BOT_COUNT ?? "100", 10);
const BOT_COUNT = Number.isNaN(rawCount) || rawCount <= 0 ? 100 : rawCount;

const rawProbability = parseFloat(process.env.NEXT_PUBLIC_BOT_PUBLISHER_PROBABILITY ?? "1");
const BOT_PUBLISHER_PROBABILITY = Number.isNaN(rawProbability) || rawProbability <= 0 ? 1 : rawProbability;


/**
 * Custom hook to spawn bots in the chat room.
 * @param {string} roomName - The name of the room to spawn bots in.
 */
export const useBots = (roomName: string | undefined) => {
  const [currentBots, setCurrentBots] = useState(0)

  useEffect(() => {
    if (!BOTS_ENABLED || !roomName || currentBots >= BOT_COUNT) return

    const initializeBot = () => {
      const clientId = generateBot()
      const client = new Ably.Realtime({
        authUrl: `/api/auth?clientId=${clientId}`,
        clientId,
      })

      const botChatClient = new ChatClient(client)
      botChatClient.rooms.get(roomName, {}).then((room) =>
        room
          .attach()
          .then(() => {
            setCurrentBots((prev) => prev + 1)
            console.debug(`Bot ${clientId} joined room ${roomName}`)

            // Check if bot should publish messages
            if (Math.random() > BOT_PUBLISHER_PROBABILITY) return

            // Function to send message and reset interval for more human-like behavior
            const sendMessageWithRandomInterval = () => {
              room.messages
                .send({ text: generateMessage() })
                .then(() => {
                  console.log(
                    `Bot ${clientId} sent message in room ${roomName}`
                  )
                })
                .catch((error) => {
                  console.error(
                    `Error sending message in room ${roomName}`,
                    error
                  )
                })
              const randomInterval =
                Math.floor(Math.random() * (BOT_INTERVAL - 10000)) + 10000
              setTimeout(sendMessageWithRandomInterval, randomInterval)
            }
            sendMessageWithRandomInterval()
          })
          .catch((error) => {
            setCurrentBots((prev) => prev + 1)
            console.error(`Error joining room ${roomName}`, error)
          })
      )
    }

    initializeBot()
  }, [roomName, currentBots])
}
