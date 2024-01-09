import {
  handleCreateMessage,
  handleQueryMessages,
} from "@/app/controllers/messagesController"

export async function GET(req: Request, { params }: any, res: Response) {
  return handleQueryMessages(req, { params }, res)
}

export async function POST(req: Request, { params }: any, res: Response) {
  return handleCreateMessage(req, { params }, res)
}
