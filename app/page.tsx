"use client"

import { useEffect, useState } from "react"
import { redirect, useSearchParams } from "next/navigation"

import { generateChannelName, isValidChannel } from "@/lib/channel"
import { useSession } from "@/hooks/useSession"
import Spinner from "@/components/Spinner"

export default function IndexPage() {
  const { session, isLoading } = useSession()
  const searchParams = useSearchParams()

  const channelName = searchParams.get("channel")

  const [channel, setChannel] = useState(channelName)

  useEffect(() => {
    if (!session?.username || isLoading) return

    if (!isValidChannel(channel)) {
      const name = generateChannelName()

      setChannel(name)
    } else {
      redirect(`/watch?channel=${channel}`)
    }
  }, [channel, isLoading, session?.username])

  return (
    <section className="container grid items-center justify-center gap-6 pb-8 pt-6 md:py-10">
      <Spinner />
    </section>
  )
}
