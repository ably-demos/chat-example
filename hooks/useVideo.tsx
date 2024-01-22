import useSWR from "swr"

import { fetchJson } from "@/lib/fetcher"
import { GETVideoResponse } from "@/app/api/video/route"

const videoApiRoute = "/api/video"

export const useVideo = () => {
  const { data, isLoading } = useSWR(videoApiRoute, fetchJson<GETVideoResponse>)

  return { video: data, isLoading }
}
