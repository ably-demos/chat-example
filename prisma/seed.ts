import { PrismaClient } from "@prisma/client"
import * as dotenv from "dotenv"

import { createUser } from "@/app/controllers/user"

dotenv.config()

const prisma = new PrismaClient()

const seed = async () => {
  const username = "Sport News"

  const user = await createUser(username, "/images/avatar.png", 855721)

  const video = await prisma.video.create({
    data: {
      title: "Teddy Makes a Cut Upfield - American Football",
      url: "/videos/green_bay_minnesota.mp4",
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
