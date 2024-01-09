import {
  handleCreateConversation,
  handleGetConversation,
} from "@/app/controllers/conversationsController"

export async function GET(req: Request, { params }: any, res: Response) {
  return handleGetConversation(req, { params }, res)
}

export async function POST(req: Request, { params }: any, res: Response) {
  return handleCreateConversation(req, { params }, res)
}
