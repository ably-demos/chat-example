import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"

import prisma from "@/lib/prisma"

// read session
export async function GET(): Promise<NextResponse<GETVideoResponse>> {
  const video = await prisma.video.findFirst({ include: { user: true } })

  return NextResponse.json(video)
}

export type GETVideoResponse = Prisma.Result<
  typeof prisma.video,
  { include: { user: true } },
  "findFirst"
>
