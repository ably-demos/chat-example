"use server"

import { createConversation } from "./inMemoryDb"

export const createChannel = async (
  name: string,
  videoId: number,
  username: string
) => {
  return await prisma?.channel.create({
    data: {
      name,
      video: {
        connect: {
          id: videoId,
        },
      },
      users: {
        connect: {
          username: username,
        },
      },
    },
  })
}

export const getChannel = async (name: string, username: string) => {
  const channel = await prisma?.channel.findUnique({
    where: { name },
    include: {
      users: { where: { username: username } },
    },
  })

  await createConversation(name)

  if (!channel) {
    throw new Error("Channel not found")
  }

  return channel
}
