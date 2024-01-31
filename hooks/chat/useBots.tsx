"use client"

import { useEffect, useState } from "react"
import { faker } from "@faker-js/faker"
import { Rest } from "ably/promises"

import { botConfig } from "@/config/bots"
import { generateMessage } from "@/lib/bot"

import { useInterval } from "../useInterval"

const generateBot = (prefix: string) =>
  faker.internet.userName({ firstName: prefix })

const BOTS_ENABLED = process.env.NEXT_PUBLIC_WITH_BOTS === "true"
const BOT_INTERVAL = 5000

export const useBots = (channelName?: string) => {
  const [clientId, setClientId] = useState(generateBot(botConfig.idPrefix))

  useInterval(() => {
    setClientId(generateBot(botConfig.idPrefix))
  }, BOT_INTERVAL)

  useEffect(() => {
    if (!BOTS_ENABLED && channelName) return
    const client = new Rest({
      authUrl: "/api/auth",
      restHost: "eu-west-2-a.primary.chat.cluster.ably-nonprod.net",
      realtimeHost: "eu-west-2-a.primary.chat.cluster.ably-nonprod.net",
      clientId,
    })

    client.request(
      "POST",
      `/conversations/v1/conversations/${channelName}/messages`,
      {},
      { content: generateMessage() }
    )
  })
}
