import { PrismaClient } from "@prisma/client"
import * as dotenv from "dotenv"

import { createUser } from "@/app/controllers/user"

dotenv.config()

const prisma = new PrismaClient()

const seed = async () => {
  const username = "Sport News"

  const user = await createUser(username, 855721)

  const video = await prisma.video.create({
    data: {
      title: "Chiefs vs. Buccaneers | Super Bowl LV Game Highlights",
      url: "/videos/Chiefs_Buccaneers.mp4",
      views: 928,
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  })

  const channel = await prisma.channel.create({
    data: {
      name: "default",
      video: {
        connect: {
          id: video.id,
        },
      },
    },
  })

  console.info(user, video, channel)
}

seed()
