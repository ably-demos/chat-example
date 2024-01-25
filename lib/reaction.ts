import { Message, Reaction } from "@ably-labs/chat"

export const getReactionFromCode = (code: string) => {
  return String.fromCodePoint(parseInt(code, 16))
}

export const mapFromUpdate = (
  username: string,
  message: Message,
  reaction: Reaction
) => {
  if (message.id !== reaction.message_id) {
    return message
  }

  const isMine = reaction.client_id === username
  const updatedMineReactions = isMine
    ? [...message.reactions.mine, reaction]
    : message.reactions.mine
  const updatedLatestReactions = [...message.reactions.latest, reaction]
  const updatedCounts = {
    ...message.reactions.counts,
    [reaction.type]: (message.reactions.counts[reaction.type] ?? 0) + 1,
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
  username: string,
  message: Message,
  reaction: Reaction
) => {
  if (message.id !== reaction.message_id) {
    return message
  }

  const isMine = reaction.client_id === username
  const updatedMineReactions = isMine
    ? message.reactions.mine.filter(({ id }) => id !== reaction.id)
    : message.reactions.mine

  const updatedLatestReactions = message.reactions.latest.filter(
    ({ id }) => id !== reaction.id
  )
  const updatedCounts = {
    ...message.reactions.counts,
    [reaction.type]: (message.reactions.counts[reaction.type] ?? 0) + 1,
    ...message.reactions.counts,
    [reaction.type]: message.reactions.counts[reaction.type] - 1,
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
