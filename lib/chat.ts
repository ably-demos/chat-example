export {}
// import {
//   ConversationController,
//   Conversation as IConversation,
//   Message,
//   Reaction,
// } from "@ably-labs/chat"

// export class Chat {
//     client:

// export class Conversation implements IConversation {
//   id: string
//   application_id: string
//   ttl: number | null
//   created_at: number
//   messages: ChatMessage[]
//   constructor(_conversation: IConversation) {
//     this.id = _conversation.id
//     this.application_id = _conversation.application_id
//     this.ttl = _conversation.ttl
//     this.created_at = _conversation.created_at
//   }
// }

// export class ChatMessage implements Message {
//   id: string
//   client_id: string
//   conversation_id: string
//   content: string
//   reactions: {
//     counts: Record<string, number>
//     latest: Reaction[]
//     mine: Reaction[]
//   }
//   created_at: number
//   updated_at: number | null
//   deleted_at: number | null
//   constructor(_message: Message) {
//     this.id = _message.id
//     this.client_id = _message.client_id
//     this.conversation_id = _message.conversation_id
//     this.content = _message.content
//     this.reactions = _message.reactions
//     this.created_at = _message.created_at
//     this.updated_at = _message.updated_at
//     this.deleted_at = _message.deleted_at
//   }

//   addReaction(reaction: string) {
//     return this.reactions.counts[reaction]++
//   }

//   removeReaction(reaction: string) {
//     return this.reactions.counts[reaction]--
//   }
// }
