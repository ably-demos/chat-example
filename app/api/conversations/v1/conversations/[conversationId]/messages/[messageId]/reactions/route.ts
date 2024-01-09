import {
  handleAddReaction,
  handleDeleteReaction,
} from "@/app/controllers/reactionsController"

export async function GET(req: Request, { params }: any, res: Response) {
  return handleAddReaction(req, { params }, res)
}

export async function POST(req: Request, { params }: any, res: Response) {
  return handleDeleteReaction(req, { params })
}
