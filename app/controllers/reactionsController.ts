import * as Ably from "ably/promises"

import { addReaction, deleteReaction } from "./inMemoryDb"

export const handleAddReaction = async (
  req: Request,
  {
    params,
  }: {
    params: {
      conversationId: string
      messageId: string
    }
  }
) => {
  const conversationId = params.conversationId
  const ablyToken = req.headers.get("authorization")?.split(" ")[1] ?? ""

  const body = await req.json()
  const reaction = await addReaction({
    message_id: params.messageId,
    conversation_id: conversationId,
    client_id: req.headers.get("ably-clientid") ?? "",
    ...body,
  })

  const client = new Ably.Rest(ablyToken)

  client.channels
    .get(`conversations:${conversationId}`)
    .publish("reaction.added", reaction)

  return Response.json(
    { id: reaction.id },
    {
      status: 201,
    }
  )
}

export const handleDeleteReaction = async (
  req: Request,
  { params }: { params: { reactionId: string } }
) => {
  const reactionId = params.reactionId
  const ablyToken = req.headers.get("authorization")?.split(" ")[1] ?? ""

  const reaction = await deleteReaction(reactionId)

  const client = new Ably.Rest(ablyToken)

  client.channels
    .get(`conversations:${reaction.conversation_id}`)
    .publish("reaction.deleted", reaction)

  return Response.json(
    { id: reaction.id },
    {
      status: 201,
    }
  )
}
