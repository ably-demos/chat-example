import { handleDeleteReaction } from "@/app/controllers/reactionsController"

export async function DELETE(req: Request, { params }: any, res: Response) {
  return handleDeleteReaction(req, { params })
}
