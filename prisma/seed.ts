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
      title: "Back To The Future",
      url: "/videos/back_to_the_future.mp4",
      views: 928,
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  })

  console.info(user, video)
}

seed()
