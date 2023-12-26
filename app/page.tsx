"use client"

import { useEffect } from "react"
import { redirect } from "next/navigation"

import useSession from "@/hooks/useSession"
import LoadingDots from "@/components/LoadingDots"

export default function IndexPage() {
  const { session, create } = useSession()

  useEffect(() => {
    if (!session?.channelRef) {
      console.info("Creating user session")
      create()
      return
    }

    console.debug("Redirecting to channel", session.channelRef)
    redirect(session.channelRef)
  }, [create, session])

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <LoadingDots />
    </section>
  )
}
