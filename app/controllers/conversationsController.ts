import { createConversation, getConversation } from "./inMemoryDb"

export const handleCreateConversation = (
  req: Request,
  { params }: { params: { conversationId: string } },
  res: Response
) => {
  const conversationId = params.conversationId
  return Response.json(createConversation(conversationId))
}

export const handleGetConversation = (
  req: Request,
  { params }: { params: { conversationId: string } },
  res: Response
) => {
  const conversationId = params.conversationId
  return Response.json(getConversation(conversationId))
}