import { Message } from "@prisma/client"
import useSWR from "swr"
import useSWRMutation from "swr/mutation"

import { fetchJson } from "@/lib/fetcher"

const messageApiRoute = "/api/message"

const doFavourite = (url: string) => {
  return fetchJson(url, {
    method: "POST",
  })
}

export default function useMessage(messageId: string) {
  const { data, ...getMessage } = useSWR(
    `messageApiRoute/${messageId}`,
    fetchJson<Message>
  )

  const { trigger: favourite } = useSWRMutation(messageApiRoute, (url) =>
    doFavourite(url)
  )

  return {
    message: data,
    favourite,
    ...getMessage,
  }
}
