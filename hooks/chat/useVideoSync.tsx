import { RefObject, useEffect, useRef, useState } from "react"
import { PresenceData, PresenceEvent, PresenceListener, PresenceMember, RoomStatus } from "@ably/chat"
import {
  useChatClient,
  usePresence,
  usePresenceListener,
  useRoom,
} from "@ably/chat/react"
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
  const { roomName, roomStatus } = useRoom()
  const { clientId } = useChatClient()
  const hasJoinedPresence = useRef(false)
  const { enter, update, leave } = usePresence({ autoEnterLeave: false })
  const { presenceData } = usePresenceListener({
    listener: (event: PresenceEvent) => {
      if (isLeader) return
      const data = event.member.data as { currentTime: number; leader: string }
      if (!data) return
      setNewSyncedTime(data.currentTime)
      setLeader(data.leader)
      console.log("Received presence update:", data)
    }
  })
  const canEnterPresence = roomStatus === RoomStatus.Attached;

  const presenceMembersRef = useRef<PresenceMember[]>(presenceData)
  useEffect(() => {
    presenceMembersRef.current = presenceData
  }, [presenceData])

  useEffect(() => {
    const storedLeaderData = localStorage.getItem("roomLeader")
    if (!storedLeaderData) return
    const { storedLeader, storedRoomId } = JSON.parse(storedLeaderData)
    if (storedLeader === clientId && storedRoomId === roomName) {
      setIsLeader(true)
      setLeader(storedLeader)
    }
  }, [clientId, roomName])

  useEffect(() => {
    if (!leader || !roomName) return
    localStorage.setItem(
      "roomLeader",
      JSON.stringify({ storedLeader: leader, storedRoomId: roomName })
    )
  }, [leader, roomName])

  useEffect(() => {
    if (!clientId || !canEnterPresence) return

    const joinPresence = async () => {
      try {
        await enter()

        // If nobody else is leading, we're the leader
        const leader = presenceMembersRef.current.length === 0 || presenceMembersRef.current.length === 1 && presenceMembersRef.current[0].clientId === clientId 
        if (leader) {
          setIsLeader(true)
          setLeader(clientId)
          await update({
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
        leave().then(() => {
          hasJoinedPresence.current = false
        })
      }
    }
  }, [canEnterPresence, roomName, enter, update, leave, clientId])

  useEffect(() => {
    if (!clientId || !isLeader) return
    const interval = setInterval(() => {
      const currentTime = videoRef.current?.getCurrentTime() || 0
      update({ currentTime, leader: clientId })
    }, 1000)

    return () => clearInterval(interval)
  }, [isLeader, update, clientId, videoRef])

  return { newSyncedTime, leader, isLeader }
}
