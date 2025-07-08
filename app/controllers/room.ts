"use server"

import prisma from "@/lib/prisma"

export const createRoom = async (name: string, videoId: number) => {
  return prisma?.room.create({
    data: {
      name,
      video: {
        connect: {
          id: videoId,
        },
      },
    },
  })
}

export const getRoom = async (name: string) => {
  return await prisma?.room.findUnique({
    where: { name },
  })
}
