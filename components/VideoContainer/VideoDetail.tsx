import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Clock10Icon, UserIcon } from "lucide-react"

type Props = {
  title: string
  views: number
  username: string
  avatar: string
  subscribers: number
}

const VideoDetail = ({
  title,
  views,
  username,
  avatar,
  subscribers,
}: Props) => {
  return (
    <>
      <div className="my-4 flex w-full justify-between">
        <h1 className="text-[20px]">{title}</h1>
        <div className="hidden space-x-4 md:inline-flex">
          <p className="inline-flex space-x-2.5 font-semibold text-red">
            <UserIcon size={22} /> 
            <span>{views}</span>
          </p>
          <p className="inline-flex space-x-2.5 font-semibold">
            <Clock10Icon />
            <span>01:20:13</span>
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative w-12 rounded-full border border-red p-1">
          <Avatar className="size-12">
            <AvatarImage src={avatar} alt="Image" className="rounded-full"/>
            <AvatarFallback>
              {username.split(" ").map((item) => item.charAt(0))}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 left-1.5 w-9 rounded-sm border-[1.5px] border-white bg-white text-center text-xs">
            <p className="rounded-sm bg-live px-1 text-xs font-semibold text-white">
              LIVE
            </p>
          </div>
        </div>
        <div className="leading-normal">
          <p className="font-medium ">{username}</p>
          <p className="text-xs text-muted-foreground lg:text-base">
            { subscribers.toLocaleString('en-US')} Subscribers
          </p>
        </div>
      </div>
    </>
  )
}

export default VideoDetail
