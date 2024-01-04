import { memo, useRef, useState } from "react"
import clsx from "clsx"
import { Volume1Icon, Volume2Icon, VolumeXIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

type Props = {
  defaultVolume?: number
  onChange: (volume: number) => void
}

const VolumeIcon = memo(function VolumeIcon({
  volume,
  muted,
}: {
  muted: boolean
  volume: number
}) {
  if (muted || volume === 0) {
    return <VolumeXIcon />
  }
  if (volume < 50) {
    return <Volume1Icon />
  }
  return <Volume2Icon />
})

const Volume = ({ defaultVolume = 0.5, onChange }: Props) => {
  const volume = useRef(defaultVolume)
  const [muted, setMuted] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  const handleVolumeClick = () => {
    setIsOpen(true)
    setMuted(!muted)
  }

  const handleMouseEnter = () => {
    setIsOpen(true)
  }

  const handleSliderChange = (value: number[]) => {
    onChange(value[0])
  }

  return (
    <div className="flex grow">
      <Button
        variant="ghost"
        onClick={handleVolumeClick}
        onMouseEnter={handleMouseEnter}
      >
        <VolumeIcon volume={volume.current} muted={muted} />
      </Button>
      {isOpen ? (
        <Slider
          step={0.01}
          defaultValue={[volume.current]}
          min={0}
          max={1}
          className={clsx("w-[60%] max-w-[200px]", {
            "opacity-100": isOpen,
            "opacity-0": !isOpen,
            "animate-in": isOpen,
          })}
          onValueChange={handleSliderChange}
        />
      ) : null}
    </div>
  )
}

export default Volume
