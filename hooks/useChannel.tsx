import { Channel } from "@prisma/client"
import useSWR from "swr"

export const useChannel = (channelId: string) => {
  const { data, error, isLoading } = useSWR<Channel>(
    `/api/channel/${channelId}`
  )

  return { channel: data, error, isLoading }
}
