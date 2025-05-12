"use client"

import { useEffect, useState, useRef } from "react"
import { ChatClient } from "@ably/chat"
import { faker } from "@faker-js/faker"
import * as Ably from "ably"

import { generateMessage } from "@/lib/bot"
import { useRoom } from '@ably/chat/react';

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
  const [currentBots, setCurrentBots] = useState(0)
  const botClientsRef = useRef<Ably.Realtime[]>([])
  const botChatClientsRef = useRef<ChatClient[]>([])
  const botRoomsRef = useRef<any[]>([])
  const timeoutsRef = useRef<NodeJS.Timeout[]>([])

  useEffect(() => {
    if (!BOTS_ENABLED || !roomName || currentBots >= BOT_COUNT) return

    const initializeBot = async () => {
      const clientId = generateBot()
      const client = new Ably.Realtime({
        authUrl: `/api/auth?clientId=${clientId}`,
        clientId,
        environment: 'local',
        tls: false,
        port: 8081,
      })
      botClientsRef.current.push(client)

      const botChatClient = new ChatClient(client)
      botChatClientsRef.current.push(botChatClient)

      const room = await botChatClient.rooms.get(roomName)
      botRoomsRef.current.push(room)

      await room.attach()
      setCurrentBots((prev) => prev + 1)
      console.debug(`Bot ${clientId} joined room ${roomName}`)

      if (Math.random() > BOT_PUBLISHER_PROBABILITY) return

      const sendMessageWithRandomInterval = () => {
        room.messages
          .send({ text: generateMessage() })
          .then(() => {
            console.log(`Bot ${clientId} sent message in room ${roomName}`)
          })
          .catch((error) => {
            console.error(
              `Error sending message in room ${roomName}`,
              error
            )
          })
        const randomInterval =
          Math.floor(Math.random() * (BOT_INTERVAL - 10000)) + 10000
        const timeoutId = setTimeout(sendMessageWithRandomInterval, randomInterval)
        timeoutsRef.current.push(timeoutId)
      }

      sendMessageWithRandomInterval()
    }
    initializeBot()

    // Cleanup function
    return () => {
      // Clear all timeouts
      timeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId))
      timeoutsRef.current = []

      // Release all rooms
      // botRoomsRef.current.forEach(room => {
      //   if (room && typeof room.release === 'function') {
      //     room.release().catch(error => {
      //       console.error(`Error releasing room ${roomName}`, error)
      //     })
      //   }
      // })
      botRoomsRef.current = []

      // Close all clients
      // botClientsRef.current.forEach(client => {
      //   if (client && typeof client.close === 'function') {
      //     client.close()
      //   }
      // })
      botClientsRef.current = []
      botChatClientsRef.current = []

      setCurrentBots(0)

      console.debug(`Cleaned up all bots for room ${roomName}`)
    }
  }, [roomName, currentBots])
}
