import { RefObject, useEffect, useRef, useState } from "react"
import { PresenceListener } from "@ably/chat"
import { useChatClient, useRoom } from "@ably/chat/react"
import ReactPlayer from "react-player/file"

interface VideoSyncState {
  newSyncedTime: number
  leader: string
  isLeader: boolean
}

/**
 * Custom hook to synchronize video playback across multiple clients using Ably presence.
 * @param {React.RefObject<ReactPlayer>} videoRef - Reference to the ReactPlayer component.
 * @returns {Object} - The current time, leader information, and isLeader flag.
 */

export const useVideoSync = (
  videoRef: RefObject<ReactPlayer>
): VideoSyncState => {
  const [newSyncedTime, setNewSyncedTime] = useState(0)
  const [isLeader, setIsLeader] = useState(false)
  const [leader, setLeader] = useState<string>("")
  const { room, roomId } = useRoom()
  const { clientId } = useChatClient()
  const hasJoinedPresence = useRef(false)
  useEffect(() => {
    const storedLeaderData = localStorage.getItem("roomLeader")
    if (!storedLeaderData) return
    const { storedLeader, storedRoomId } = JSON.parse(storedLeaderData)
    if (storedLeader === clientId && storedRoomId === roomId) {
      setIsLeader(true)
      setLeader(storedLeader)
    }
  }, [clientId, roomId])

  useEffect(() => {
    if (!leader || !roomId) return
    localStorage.setItem(
      "roomLeader",
      JSON.stringify({ storedLeader: leader, storedRoomId: roomId })
    )
  }, [leader, roomId])

  useEffect(() => {
    if (!clientId || !room) return

    const joinPresence = async () => {
      try {
        await room.presence.enter()
        const members = await room.presence.get()

        if (members.length === 1) {
          setIsLeader(true)
          setLeader(clientId)
          await room.presence.update({
            currentTime: 0,
            playing: true,
            leader: clientId,
          })
          console.log("Leader elected:", clientId)
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
        room.presence.leave().then(() => {
          hasJoinedPresence.current = false
        })
      }
    }
  }, [room, clientId])

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
    if (!clientId || !isLeader || !room) return
    const interval = setInterval(() => {
      const currentTime = videoRef.current?.getCurrentTime() || 0
      room.presence.update({
        currentTime,
        leader: clientId,
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isLeader, room, clientId, videoRef])

  return { newSyncedTime, leader, isLeader }
}
