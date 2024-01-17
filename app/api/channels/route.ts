import { Chat } from "@ably-labs/chat"
import { Realtime } from "ably"

import prisma from "@/lib/prisma"
import { getSession } from "@/lib/session"
import { createChannel } from "@/app/controllers/channel"

export async function POST(req: Request) {
  const session = await getSession()
  const { name } = await req.json()

  // TODO: Validate with @andy, it looks a bit odd to me
  // Potential Alternative
  // /**
  //  * This creates a channel, if it doesn't exist.
  //  */
  debugger

  const video = await prisma?.video.findFirst({})

  if (!video) return Response.redirect("/")

  const channel = await createChannel(name, video.id, session.username)

  const ablyClient = new Realtime.Promise({ key: process.env.ABLY_API_KEY! })
  ablyClient.connect()

  const chat = new Chat(ablyClient)

  await chat.conversations.get(name).create()
  debugger
  ablyClient.close()

  return Response.json(channel)
}
