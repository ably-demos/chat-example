# Ably Chat Reference Application

## Usage

```bash
npx create-next-app -e https://github.com/ably-labs/reference-app

```

Requirements
Ably SDK Key
SDK identify auth

## Features

- Next.js 14 App Directory
- Radix UI Primitives
- Tailwind CSS
- Icons from [Lucide](https://lucide.dev)
- Tailwind CSS class sorting, merging and linting.

## License

Licensed under the [MIT license](https://github.com/shadcn/ui/blob/main/LICENSE.md).

```mermaid
---
title: Chat SDK
---
classDiagram
    note for Chat "Conversations repo"
    class Chat {
        -Realtime realtime
		+ConversationsController conversations
        +connection()
        +clientId()
    }
	class ConversationsController {
	    -Realtime realtime
	    -ChatApi chatApi
	    -Conversation conversations
	    get(conversationId: string): Conversation
	    release(conversationId: string): Promise void
	}

    class Conversation {
        -String conversationId
        -ChatApi chatApi
        -RealtimeChannelPromise channel
        -Messages messages
        create()
        members()
        delete()
    }

	class Messages {
        -String conversationId
        -Promise channel
        -ChatApi chatApi
        -subscribe(Unknown event): void
        -unsubscribe(Function subFn): void
        -query(): List~Message~
    class Message {
		reactions: MessageReaction
	}
    <<interface>> Message

		class MessageReactions~Object~ {
			counts: Object~string, int~
			latest: List~Reaction~
			mine: List~Reaction~
		}

    class Object {
		+index
		+value
	}
    <<Abstract>> Object

    class Reaction {
		String id
	    String message_id
	    String type
	}
    <<interface>> Reaction

	class IConversation
    <<interface>> IConversation

 	Chat *-- ConversationsController
    ConversationsController *-- Conversation
    Conversation *-- Messages
    Messages *-- Message
	Message -- MessageReactions
	MessageReactions *-- Reaction
	ConversationsController -- IConversation: Both called Conversation
```
