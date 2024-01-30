import { Message, Reaction } from "@ably-labs/chat"

export const getReactionFromCode = (code: string) => {
  return String.fromCodePoint(parseInt(code, 16))
}

export const mapFromUpdate = (
  message: Message,
  reaction: Reaction,
  username?: string
) => {
  if (message.id !== reaction.message_id) {
    return message
  }

  const { mine, latest, counts } = message.reactions ?? {
    mine: [],
    latest: [],
    counts: {},
  }

  const isMine = reaction.created_by === username
  const updatedMineReactions = isMine ? [...mine, reaction] : mine
  const updatedLatestReactions = [...latest, reaction]
  const updatedCounts = {
    ...counts,
    [reaction.type]: (counts[reaction.type] ?? 0) + 1,
  }

  return {
    ...message,
    reactions: {
      mine: updatedMineReactions,
      latest: updatedLatestReactions,
      counts: updatedCounts,
    },
  }
}

export const mapFromDelete = (
  message: Message,
  reaction: Reaction,
  username?: string
): Message => {
  if (message.id !== reaction.message_id) {
    return message
  }

  const isMine = reaction.created_by === username

  const { mine, latest, counts } = message.reactions ?? {
    mine: [],
    latest: [],
    counts: {},
  }

  const updatedMine = isMine
    ? mine.filter(({ id }) => id !== reaction.id)
    : mine

  const updatedLatest = latest.filter(({ id }) => id !== reaction.id)
  const updatedCounts = {
    ...counts,
    [reaction.type]: (counts[reaction.type] ?? 1) - 1,
  }

  return {
    ...message,
    reactions: {
      mine: updatedMine,
      latest: updatedLatest,
      counts: updatedCounts,
    },
  }
}
