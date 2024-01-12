"use client"

import { useEffect, useState } from "react"
import { redirect, useSearchParams } from "next/navigation"

import { getRandomChannel, isValidChannel } from "@/lib/channel"
import useSession from "@/hooks/useSession"
import Spinner from "@/components/Spinner"

export default function IndexPage() {
  const { session, isLoading, createSession } = useSession()
  const searchParams = useSearchParams()

  const [channelId, setChannelId] = useState(searchParams.get("channel"))

  const [channel, setChannel] = useState(channelId)
  useEffect(() => {
    if (!session?.username && !isLoading) {
      createSession()
    }
  }, [createSession, isLoading, session?.username])

  useEffect(() => {
    if (!session?.username) return

    if (!isValidChannel(channel)) {
      const channelId = getRandomChannel()

      setChannel(channelId)
    } else {
      redirect(`/watch?channel=${channel}`)
    }
  }, [channel, session?.username])

  return (
    <section className="container grid items-center justify-center gap-6 pb-8 pt-6 md:py-10">
      <Spinner />
    </section>
  )
}
