import { PrismaClient } from "@prisma/client"
import * as dotenv from "dotenv"

dotenv.config()

const prisma = new PrismaClient()

const seed = async () => {
  const user = await prisma.user.create({
    data: {
      name: "Sport News",
      subscribers: 855721,
    },
  })

  const video = await prisma.video.create({
    data: {
      title: "Rick Astley - Never Gonna Give You Up (Video)",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      views: 928,
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  })
}
