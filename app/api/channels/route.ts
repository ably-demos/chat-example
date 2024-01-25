import prisma from "@/lib/prisma"
import { getSession } from "@/lib/session"
import { createChannel } from "@/app/controllers/channel"
import { getChatClient } from "@/app/controllers/chat"

export async function POST(req: Request) {
  const session = await getSession()
  const { name } = await req.json()

  // /**
  //  * This creates a channel, if it doesn't exist.
  //  */

  const video = await prisma?.video.findFirst({})

  if (!video) return Response.redirect("/")

  const channel = await createChannel(name, video.id, session.username)

  const chat = await getChatClient()

  await chat.conversations.get(name).create()

  chat.connection.close()

  return Response.json(channel)
}
