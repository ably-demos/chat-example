import { User, Video } from "@prisma/client"
import useSWR from "swr"

import { fetchJson } from "@/lib/fetcher"

const videoApiRoute = "/api/video"

export default function useVideo() {
  const { data: video, isLoading } = useSWR(
    videoApiRoute,
    fetchJson<Video & { user: User }>
  )

  return { video, isLoading }
}
