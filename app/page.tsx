"use client"

import { useEffect, useState } from "react"
import { redirect, useSearchParams } from "next/navigation"

import { generateRoomName, isValidRoom } from "@/lib/room"
import { useSession } from "@/hooks/useSession"
import Spinner from "@/components/Spinner"

export default function IndexPage() {
  const { session, isLoading } = useSession()
  const searchParams = useSearchParams()

  const roomName = searchParams.get("room")

  const [room, setRoom] = useState(roomName)

  useEffect(() => {
    if (!session?.username || isLoading) return

    // We will redirect to the watch page if the room is valid
    if (!isValidRoom(room)) {
      // See if we have a default room name else grab a random room name
      const name = process.env.NEXT_PUBLIC_DEFAULT_ROOM || generateRoomName()
      setRoom(name)
    } else {
      redirect(`/watch?room=${room}`)
    }
  }, [room, isLoading, session?.username])

  return (
    <section className="container grid items-center justify-center gap-6 pb-8 pt-6 md:py-10">
      <Spinner />
    </section>
  )
}
