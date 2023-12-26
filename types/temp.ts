export type Client = {
  id: string
  user_id: string
  created_at: number
  updated_at: number | null
  deleted_at: number | null
  channels: Channel[]
  users: User[]
}

export type Channel = {
  id: string
  name: string
  imageUrl: string
  users: User[]
  messages: Message[]
}

export type ChannelMember = {
  id: string
  channel_id: Channel["id"]
  user_id: User["id"]
  created_at: number
  updated_at: number | null
  deleted_at: number | null
  messages: Message[]
}

export type User = {
  id: string
  username: string
  imageUrl: string
}

export type Message = {
  id: string
  client_id: string
  user_id: User["id"]
  conversation_id: string
  content: string
  reactions: {
    counts: Record<string, number>
    latest: Reaction[]
    mine: Reaction[]
  }
  messageParts?: MessagePart[]
  created_at: number
  updated_at: number | null
  deleted_at: number | null

  // OLD FIELDS
  // id: string
  timestamp: number
  data: string
  clientId: string
  connectionId: string
  name: string
  imestamp: 1703896018849
}

export type MessagePart = {
  type: "text" | "plainLink" | "textLink" | "mention"
  content: {
    text?: string
    link?: string
    userId?: string
    name?: string
  }
}

enum ReactionType {
  Like = "like",
  Love = "love",
  Haha = "haha",
  Wow = "wow",
  Sad = "sad",
  Angry = "angry",
}

export type Reaction = {
  id: string
  client_id: string
  user_id: User["id"]
  conversation_id: string
  message_id: string
  reaction: ReactionType
  created_at: number
  updated_at: number | null
  deleted_at: number | null
}
