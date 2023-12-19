"use client"

import { useCallback, useEffect, useState } from "react"
import { Channel, User } from "types/temp"

export const useMembers = (channel?: Channel) => {
  const [members, setMembers] = useState<User[]>([])
  const init = useCallback(async () => {
    if (!channel) return

    // TODO: implement
    // const memberData = await channel.getMembers();

    // setMembers(memberData.members);
  }, [channel])

  useEffect(() => {
    init()
  }, [init])
  return [members, setMembers] as const
}
