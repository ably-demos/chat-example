import {
  handleDeleteMessages,
  handleEditMessages,
} from "@/app/controllers/messagesController"

export async function POST(req: Request, { params }: any, res: Response) {
  return handleEditMessages(req, { params }, res)
}

export async function DELETE(req: Request, { params }: any, res: Response) {
  return handleDeleteMessages(req, { params }, res)
}
