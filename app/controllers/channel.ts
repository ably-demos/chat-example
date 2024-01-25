"use server"

import prisma from "@/lib/prisma"

export const createChannel = async (
  name: string,
  videoId: number,
  username: string
) => {
  return prisma?.channel.create({
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

  if (!channel) {
    throw new Error("Channel not found")
  }

  return channel
}
