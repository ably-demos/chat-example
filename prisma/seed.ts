import { PrismaClient } from "@prisma/client"
import * as dotenv from "dotenv"

dotenv.config()

const prisma = new PrismaClient()

const seed = async () => {
  const username = "Sport News"

  const user = await prisma.user.create({
    data: {
      username,
      subscribers: 855721,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        username
      )}&rounded=true&background=random`,
    },
  })

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
