import * as Ably from "ably/promises"

import {
  createMessage,
  deleteMessage,
  editMessage,
  findMessages,
} from "./inMemoryDb"

export const handleCreateMessage = async (
  req: Request,
  { params }: { params: { conversationId: string } },
  res: Response
) => {
  const conversationId = params.conversationId

  const ablyToken = req.headers.get("authorization")?.split(" ")[1] ?? ""

  const body = await req.json()
  const message = createMessage({
    ...body,
    client_id: req.headers.get("ably-clientid") ?? "",
    conversation_id: conversationId,
  })

  const client = new Ably.Rest(ablyToken)

  client.channels
    .get(`conversations:${conversationId}`)
    .publish("message.created", message)

  return Response.json({ id: message.id }, { status: 201 })
}

export const handleQueryMessages = (
  req: Request,
  { params }: { params: { conversationId: string } },
  res: Response
) => {
  const conversationId = params.conversationId
  return Response.json(
    findMessages(conversationId, req.headers.get("ably-clientid") ?? "")
  )
}

export const handleEditMessages = async (
  req: Request,
  { params }: { params: { conversationId: string; messageId: string } },
  res: Response
) => {
  const conversationId = params.conversationId
  const ablyToken = req.headers.get("authorization")?.split(" ")[1] ?? ""

  const body = await req.json()
  const message = editMessage({
    id: params.messageId,
    conversation_id: conversationId,
    ...body,
  })

  const client = new Ably.Rest(ablyToken)

  client.channels
    .get(`conversations:${conversationId}`)
    .publish("message.updated", message)

  return Response.json({ id: message.id }, { status: 201 })
}

export const handleDeleteMessages = (
  req: Request,
  { params }: { params: { conversationId: string; messageId: string } },
  res: Response
) => {
  const conversationId = params.conversationId
  const ablyToken = req.headers.get("authorization")?.split(" ")[1] ?? ""

  const message = deleteMessage({
    id: params.messageId,
    conversation_id: conversationId,
  })

  const client = new Ably.Rest(ablyToken)

  client.channels
    .get(`conversations:${conversationId}`)
    .publish("message.deleted", message)

  return Response.json({ id: message.id }, { status: 201 })
}
