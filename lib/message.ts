import { TypeToZod } from "@/types"
import { Message, Reaction } from "@ably-labs/chat"
import z from "zod"

const reactionSchema = z.object<TypeToZod<Reaction>>({
  id: z.string(),
  message_id: z.string(),
  type: z.string(),
  client_id: z.string(),
  updated_at: z.number().nullable(),
  deleted_at: z.number().nullable(),
})

const messageSchema = z.object<TypeToZod<Message>>({
  id: z.string(),
  created_by: z.string(),
  conversation_id: z.string(),
  content: z.string(),
  created_at: z.number().nullable(),
  edited_at: z.number().nullable(),
  deleted_at: z.number().nullable(),
  reactions: z.object({
    counts: z.record(z.number()),
    latest: z.array(reactionSchema),
    mine: z.array(reactionSchema),
  }),
})

export const isMessage = (value: any): value is Message => {
  return messageSchema.safeParse(value).success
}
