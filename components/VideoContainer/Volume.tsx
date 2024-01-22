import { memo, useEffect, useState } from "react"
import { Transition } from "@tailwindui/react"
import clsx from "clsx"
import { Volume1Icon, Volume2Icon, VolumeXIcon } from "lucide-react"

import { useDebounce } from "@/hooks/useDebounce"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

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
  if (volume < 0.5) {
    return <Volume1Icon />
  }
  return <Volume2Icon />
})

type VolumeProps = {
  defaultVolume?: number
  defaultMuted?: boolean
  onChange: (volume: number) => void
}

const Volume = ({
  defaultVolume = 0.5,
  defaultMuted,
  onChange,
}: VolumeProps) => {
  const [volume, setVolume] = useState(defaultVolume)
  const [muted, setMuted] = useState(defaultMuted ?? true)
  const [sliderOpen, setSliderOpen] = useState(false)

  useEffect(() => {
    if (muted) {
      onChange(0)
    } else {
      onChange(volume)
    }
  }, [volume, muted, onChange])

  const { fn: debouncedLeave, cancel: cancelLeave } = useDebounce(() => {
    setSliderOpen(false)
  }, 2500)

  const handleVolumeClick = () => {
    setSliderOpen(true)
    setMuted(!muted)
  }

  const handleMouseEnter = () => {
    setSliderOpen(true)
    cancelLeave()
  }

  const handleMouseLeave = () => {
    debouncedLeave()
  }

  const handleSliderChange = (value: [number]) => {
    setVolume(value[0])
  }

  return (
    <div className="dark flex grow">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleVolumeClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="text-white/95"
      >
        <VolumeIcon volume={volume} muted={muted} />
      </Button>
      <Transition
        show={sliderOpen}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="ml-2 flex h-9 w-full items-center"
      >
        <Slider
          key={sliderOpen ? "open" : "closed"}
          step={0.01}
          value={[volume]}
          min={0}
          max={1}
          className={clsx("w-[60%] max-w-[200px]")}
          onValueChange={handleSliderChange}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      </Transition>
    </div>
  )
}

export default Volume
