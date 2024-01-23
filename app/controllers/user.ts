"use server"

import { faker } from "@faker-js/faker/locale/en_GB"

import prisma from "@/lib/prisma"

export const generateUsername = async () => {
  let username
  do {
    username = faker.internet.userName()
  } while (await prisma.user.findUnique({ where: { username } }))
  return username
}

export const createUser = async (username: string, avatar?: string, subscribers?: number) => {
  return await prisma.user.create({
    data: {
      username,
      avatar: avatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(
        username
      )}&rounded=true&background=random`,
      subscribers,
    },
  })
}
