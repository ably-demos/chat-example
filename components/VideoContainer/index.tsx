import React from "react"
import {
  Clock10Icon,
  PauseIcon,
  UserIcon,
  Video,
  Volume2Icon,
} from "lucide-react"
import ReactPlayer from "react-player/file"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import RoomReactions from "./RoomReactions"
import VideoDetail from "./VideoDetail"

type VideoContainerProps = {
  title: string
  url: string
  views: number
  user: {
    name: string
    avatar: string
    subscribers: number
  }
}

const VideoContainer = ({ url, title, views, user }: VideoContainerProps) => {
  return (
    <div className="flex h-full w-full justify-center bg-muted">
      <div className="m-4 flex w-full flex-col lg:max-w-7xl">
        <div className="relative flex w-full ">
          <video
            title={title}
            className="aspect-video h-full max-h-[500px] w-full max-w-screen-lg lg:h-[500px]"
            controls
          >
            <source src={url} type="video/mp4" className="w-full" />
          </video>
          {/* <div className="absolute bottom-0 left-0">
            <Button variant="ghost">
              <PauseIcon />
            </Button>
            <Button variant="ghost">
              <Volume2Icon />
            </Button>
            <RoomReactions />
          </div> */}
        </div>
        <VideoDetail
          views={views}
          username={user.name}
          avatar={user.avatar}
          subscribers={user.subscribers}
        />
      </div>
    </div>
  )
}

export default VideoContainer
