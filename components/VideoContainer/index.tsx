import React from "react"
import { Clock10Icon, PauseIcon, UserIcon, Volume2Icon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

type VideoContainerProps = {}

const VideoContainer = (props: VideoContainerProps) => {
  return (
    <div className="flex h-full w-full bg-muted">
      <div className="m-4 flex w-full flex-col lg:max-w-7xl">
        <div className="relative flex w-full ">
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="YouTube video player"
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
              <UserIcon className="mr-1" /> 928
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
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div>
            <p className="p-2 text-sm font-medium leading-none">Sports News</p>
            <p className="p-2 text-sm font-medium leading-none text-muted-foreground">
              855,721 Subscribers
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoContainer
