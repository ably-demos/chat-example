import { memo, useRef, useState } from "react"
import { Transition } from "@tailwindui/react"
import clsx from "clsx"
import { Volume1Icon, Volume2Icon, VolumeXIcon } from "lucide-react"

import { useDebounce } from "@/hooks/useDebounce"
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

  const { fn: debouncedLeave, cancel: cancelLeave } = useDebounce(() => {
    setIsOpen(false)
  }, 2500)

  const handleVolumeClick = () => {
    setIsOpen(true)
    setMuted(!muted)
  }

  const handleMouseEnter = () => {
    setIsOpen(true)
    cancelLeave()
  }

  const handleMouseLeave = () => {
    debouncedLeave()
  }

  const handleSliderChange = (value: number[]) => {
    onChange(value[0])
  }

  return (
    <div className="dark flex grow">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleVolumeClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={debouncedLeave}
        className="text-white/95"
      >
        <VolumeIcon volume={volume.current} muted={muted} />
      </Button>
      <Transition
        show
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="ml-2 flex h-9 w-full items-center"
      >
        <Slider
          step={0.01}
          defaultValue={[volume.current]}
          min={0}
          max={1}
          className={clsx("w-[60%] max-w-[200px]")}
          onValueChange={handleSliderChange}
          onMouseEnter={cancelLeave}
          onMouseLeave={handleMouseLeave}
        />
      </Transition>
    </div>
  )
}

export default Volume
