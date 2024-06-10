import { RefObject, useEffect, useRef, useState } from "react"
import { PresenceListener } from "@ably/chat/src/Presence"
import ReactPlayer from "react-player/file"

import { useChat } from "@/hooks/chat/useChat"
import { useSession } from "@/hooks/useSession"

/**
 * Custom hook to synchronize video playback across multiple clients using Ably presence.
 * @param {React.RefObject<ReactPlayer>} videoRef - Reference to the ReactPlayer component.
 * @returns {Object} - The current time, leader information, and isLeader flag.
 */

export const useVideoSync = (videoRef: React.RefObject<ReactPlayer>) => {
  const [newSyncedTime, setNewSyncedTime] = useState(0)
  const [isLeader, setIsLeader] = useState(false)
  const [leader, setLeader] = useState<string>("")
  const { room, roomId } = useChat()
  const { session } = useSession()
  const hasJoinedPresence = useRef(false)

  useEffect(() => {
    const storedLeaderData = localStorage.getItem("roomLeader")
    if (!storedLeaderData) return
    const { storedLeader, storedRoomId } = JSON.parse(storedLeaderData)
    if (storedLeader === session?.username && storedRoomId === roomId) {
      setIsLeader(true)
      setLeader(storedLeader)
    }
  }, [session?.username, roomId])

  useEffect(() => {
    if (!leader || !roomId) return
    localStorage.setItem(
      "roomLeader",
      JSON.stringify({ storedLeader: leader, storedRoomId: roomId })
    )
  }, [leader, roomId])

  useEffect(() => {
    if (!session?.username || !room) return

    const joinPresence = async () => {
      try {
        await room.presence.enter()
        const members = await room.presence.get()

        if (members.length === 1) {
          setIsLeader(true)
          setLeader(session.username)
          await room.presence.update({
            currentTime: 0,
            playing: true,
            leader: session.username,
          })
          console.log("Leader elected:", session.username)
        }
        console.log("Joined presence room")
      } catch (error) {
        console.error(`Error joining presence room: ${error}`)
      }
    }

    joinPresence().then(() => {
      hasJoinedPresence.current = true
      console.log("Presence room joined")
    })

    return () => {
      if (hasJoinedPresence.current) {
        room.presence.leave()
        hasJoinedPresence.current = false
      }
    }
  }, [room, session?.username])

  useEffect(() => {
    if (!room) return
    const handlePresenceUpdate: PresenceListener = (msg) => {
      if (isLeader) return
      const data = msg.data as { currentTime: number; leader: string }
      if (!data) return
      setNewSyncedTime(data.currentTime)
      setLeader(data.leader)
      console.log("Received presence update:", data)
    }
    const { unsubscribe } = room.presence.subscribe(handlePresenceUpdate)
    return () => {
      unsubscribe()
    }
  }, [isLeader, room])

  useEffect(() => {
    if (!session?.username || !isLeader) return
    const interval = setInterval(() => {
      const currentTime = videoRef.current?.getCurrentTime() || 0
      room.presence.update({
        currentTime,
        leader: session.username,
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isLeader, room, session?.username, videoRef])

  return { newSyncedTime, leader, isLeader }
}
