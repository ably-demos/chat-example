import React from "react"
import { Clock10Icon, PauseIcon, UserIcon, Volume2Icon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

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
          <iframe
            src={url}
            title={title}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="aspect-video w-full"
          />
          <div className="absolute bottom-0 left-0">
            <Button variant="ghost">
              <PauseIcon />
            </Button>
            <Button variant="ghost">
              <Volume2Icon />
            </Button>
            {/* TODO: Room Level reactions */}
          </div>
        </div>
        <div className="my-4 flex w-full justify-between">
          <h1 className="text-xl">
            Teddy Makes a Cut Upfield - American Football
          </h1>
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
          <div className="relative rounded-full border border-primary-foreground p-1 w-12">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} alt="Image" />
              <AvatarFallback>
                {user.name.split(" ").map((item) => item.charAt(0))}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 left-1 p-1 rounded-sm bg-muted  text-center text-xs">
              <p className="rounded-sm bg-primary-foreground px-1 text-white">
                LIVE
              </p>
            </div>
          </div>
          <div>
            <p className="p-2 text-sm font-medium leading-none">{user.name}</p>
            <p className="p-2 text-sm font-medium leading-none text-muted-foreground">
              {user.subscribers} Subscribers
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoContainer
