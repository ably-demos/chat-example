"use server"

import prisma from "@/lib/prisma"

export const createRoom = async (
  name: string,
  videoId: number,
  username: string
) => {
  return prisma?.room.create({
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

export const getRoom = async (name: string, username: string) => {
  const room = await prisma?.room.findUnique({
    where: { name },
    include: {
      users: { where: { username: username } },
    },
  })

  if (!room) {
    throw new Error("room not found")
  }

  return room
}
