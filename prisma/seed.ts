import { PrismaClient } from "@prisma/client"
import * as dotenv from "dotenv"

dotenv.config()

const prisma = new PrismaClient()

const seed = async () => {
  const name = "Sport News"

  const user = await prisma.user.create({
    data: {
      name,
      subscribers: 855721,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
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
