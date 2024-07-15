import { PrismaClient } from "@prisma/client"
import * as dotenv from "dotenv"

import { createUser } from "@/app/controllers/user"

dotenv.config()

const prisma = new PrismaClient()

const seed = async () => {
  const username = "Streaming Now"

  const user = await createUser(username, "/images/avatar.png", 855721)

  const video = await prisma.video.create({
    data: {
      title: "International Basketball Playoffs",
      url: "https://cdn.ably.com/chat/basket_ball_international.mov",
      views: 928,
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  })

  const room = await prisma.room.create({
    data: {
      name: "default",
      video: {
        connect: {
          id: video.id,
        },
      },
    },
  })

  console.info(user, video, room)
}

seed()
