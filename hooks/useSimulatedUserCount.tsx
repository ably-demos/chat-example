import { useState } from "react"

import { useInterval } from "./useInterval"

const increaseUserCount = (count: number) => {
  return Math.ceil(count * (1 + (Math.random() /10)))
}

const decreaseUserCount = (count: number) => {
  return Math.floor(count * 0.95)
}

/**
 * Simulate the number of users online, increasing and decreasing by 5% every 2.5 seconds, between 700 and 1000 users.
 *
 * @returns The number of users online
 * @example
 * const onlineUserCount = useSimulatedUserCount()
 * console.log(onlineUserCount)
 */
export const useSimulatedUserCount = () => {
  const [onlineUserCount, setOnlineUserCount] = useState(800)

  useInterval(() => {
    const decrease = Math.random() < 0.5
    let nextUserCount = decrease
      ? decreaseUserCount(onlineUserCount)
      : increaseUserCount(onlineUserCount)

    if (nextUserCount > 1000) {
      nextUserCount = decreaseUserCount(onlineUserCount)
    } else if (nextUserCount < 700) {
      nextUserCount = increaseUserCount(onlineUserCount)
    }

    setOnlineUserCount(nextUserCount)
  }, 2500)

  return onlineUserCount
}
