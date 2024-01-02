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
    // avatar: string
    subscribers: number
  }
}

const VideoContainer = ({ url, title, views, user }: VideoContainerProps) => {
  return (
    <div className="flex h-full w-full bg-muted">
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
            <span className="inline-flex text-destructive-foreground">
              <UserIcon className="mr-1" /> {views}
            </span>
            <span className="inline-flex">
              <Clock10Icon className="mr-1" /> 01:20:13
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                "Sports News"
              )}&rounded=true&background=random`}
              alt="Image"
            />
            <AvatarFallback>SN</AvatarFallback>
          </Avatar>
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
