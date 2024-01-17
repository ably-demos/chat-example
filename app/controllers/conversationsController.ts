import { createConversation, getConversation } from "./inMemoryDb"

export const handleCreateConversation = async (
  req: Request,
  { params }: { params: { conversationId: string } },
  res: Response
) => {
  const conversationId = params.conversationId
  return Response.json(await createConversation(conversationId))
}

export const handleGetConversation = async (
  req: Request,
  { params }: { params: { conversationId: string } },
  res: Response
) => {
  const conversationId = params.conversationId
  return Response.json(await getConversation(conversationId))
}
