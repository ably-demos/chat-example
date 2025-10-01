import React, { useCallback, useEffect, useRef, useState } from "react"
import { RoomReaction, RoomReactionEvent } from "@ably/chat"
import { useOccupancy, useRoomReactions } from "@ably/chat/react"
import { OnProgressProps } from "react-player/base"
import ReactPlayer from "react-player/file"

import { useVideoSync } from "@/hooks/chat/useVideoSync"

import VideoControls from "./VideoControls"
import VideoDetail from "./VideoDetail"

type VideoContainerProps = {
  title: string
  url: string
  live: boolean
}

/**
 * VideoContainer component to handle video playback and synchronization.
 * @param {Object} props - The props for the component.
 * @param {boolean} props.live - Indicates if the video is live.
 * @param {string} props.url - The URL of the video.
 * @param {string} props.title - The title of the video.
 * @returns {JSX.Element} The rendered component.
 */
const VideoContainer = ({
  live,
  url,
  title,
}: VideoContainerProps): JSX.Element => {
  const [currentTime, setCurrentTime] = useState(0)
  const videoRef = useRef<ReactPlayer>(null)
  const [volume, setVolume] = useState<number>(0.5)
  const { connections } = useOccupancy()
  const [latestRoomReaction, setLatestRoomReaction] = useState<RoomReaction>()

  const listenerCallback = useCallback((event: RoomReactionEvent) => {
    if (event.reaction.isSelf) return
    setLatestRoomReaction(event.reaction)
  }, [])

  const { sendRoomReaction } = useRoomReactions({
    listener: listenerCallback,
  })
  const { newSyncedTime } = useVideoSync(videoRef)

  // Retrieve the stored playback position from local storage on component mount
  useEffect(() => {
    const storedTime = localStorage.getItem("videoCurrentTime")
    if (storedTime) {
      setCurrentTime(parseFloat(storedTime))
    }
  }, [])

  // Store the current playback position in local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("videoCurrentTime", currentTime.toString())
  }, [currentTime])

  // Reset the video to the beginning when it ends to emulate a live stream
  const handleEnded = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(0)
      videoRef.current.seekTo(0) // Seek to the beginning of the video
      videoRef.current.getInternalPlayer().play() // Play the video again
    }
  }, [])

  // Sync the video playback position with the leader's position
  useEffect(() => {
    if (!videoRef.current) return
    const timeDifference = Math.abs(
      videoRef.current.getCurrentTime() - newSyncedTime
    )
    // Update current time to newSyncedTime if we are out of sync by more than 100ms
    if (timeDifference > 0.1) {
      videoRef.current.seekTo(newSyncedTime)
    }
  }, [newSyncedTime])

  // Update the current time whenever the video playback position changes
  const handleProgress = (state: OnProgressProps) => {
    setCurrentTime(state.playedSeconds)
  }

  return (
    <div className="flex size-full justify-center bg-muted">
      <div className="container my-10 flex w-full max-w-[1054px] flex-col">
        <div className="relative mx-auto w-full overflow-hidden rounded-2xl">
          {live && (
            <p className="absolute right-5 top-5 w-16 rounded-sm bg-live text-center">
              <span className="font-semibold leading-6 text-white">LIVE</span>
            </p>
          )}
          <ReactPlayer
            url={url}
            volume={volume}
            ref={videoRef}
            playing={true}
            onEnded={handleEnded}
            onStart={() => videoRef.current?.seekTo(currentTime)}
            onProgress={handleProgress}
            controls={false}
            width={"100%"}
            height={"100%"}
            className="aspect-video size-auto"
          />
          <VideoControls
            playing={true}
            volume={volume}
            onVolumeChange={setVolume}
            onReaction={sendRoomReaction}
            latestRoomReaction={latestRoomReaction}
          />
        </div>
        <VideoDetail title={title} views={connections} />
      </div>
    </div>
  )
}

export default VideoContainer
