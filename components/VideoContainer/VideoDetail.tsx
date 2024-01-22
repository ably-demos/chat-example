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
        <h1 className="text-xl">{title}</h1>
        <div className="inline-flex space-x-4">
          <span className="inline-flex text-primary-foreground">
            <UserIcon className="mr-1" /> {views}
          </span>
          <span className="inline-flex">
            <Clock10Icon className="mr-1" /> 01:20:13
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative w-12 rounded-full border border-primary-foreground p-1">
          <Avatar className="size-12">
            <AvatarImage src={avatar} alt="Image" />
            <AvatarFallback>
              {username.split(" ").map((item) => item.charAt(0))}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 left-1 rounded-sm bg-muted p-1  text-center text-xs">
            <p className="rounded-sm bg-primary-foreground px-1 text-white">
              LIVE
            </p>
          </div>
        </div>
        <div>
          <p className="p-2 text-sm font-medium leading-none">{username}</p>
          <p className="p-2 text-sm font-medium leading-none text-muted-foreground">
            {subscribers} Subscribers
          </p>
        </div>
      </div>
    </>
  )
}

export default VideoDetail
