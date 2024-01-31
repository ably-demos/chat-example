/**
 * Credit to Nick Litman, copied from https://github.com/NickLittman/chat-simulation
 */
function generateMessage() {
  const emojis = [
    "👽",
    "🐉",
    "🦄",
    "🔥",
    "💎",
    "🌀",
    "🌈",
    "🍄",
    "🦠",
    "🦖",
    "🦕",
    "🌌",
    "🍭",
    "🍬",
    "🍩",
    "💡",
    "🎠",
    "🛸",
    "🚀",
    "🎃",
    "🤖",
    "🔮",
    "🦑",
    "🦀",
    "🌪",
    "🌙",
    "⭐",
    "🌠",
    "💣",
    "🎉",
    "🍕",
    "🍔",
    "🍟",
    "🍺",
    "🍣",
    "🎲",
    "🧩",
    "🎮",
    "🎨",
    "🎭",
    "🎷",
    "🎸",
    "🎻",
    "🔊",
    "🎧",
    "🧙‍♂️",
    "🧚‍♀️",
    "🧜‍♂️",
    "🧞‍♀️",
    "🧟‍♂️",
  ]

  const comments = [
    "GG!",
    "That play was insane!",
    "LMAO 😂",
    "RIP",
    "What a comeback!",
    "PogChamp",
    "Kappa",
    "Can we get an F in the chat?",
    "This game is epic!",
    "Ez clap",
    "LOL",
    "Nice shot!",
    "I can't believe that just happened!",
    "Hype!",
    "This stream is fire 🔥",
    "Savage",
    "Well played!",
    "Big brain play right there",
    "Oof",
    "That was clutch!",
    "Stream lag?",
    "Glitch in the matrix?",
    "Rage quit incoming?",
    "Who else is here for the first time?",
    "This community is awesome",
    "I'm dead 💀",
    "That strategy though!",
    "Someone clip that!",
    "Donation train!",
    "Cheering from [country]!",
    "Stream hype!",
    "Can we hit [number] viewers?",
    "Who else is grinding this game?",
    "That's a big oof",
    "Shoutout to the mods!",
    "Who's ready for the next round?",
    "This chat is wild",
    "I'm literally shaking",
    "Can't stop watching",
    "Let's goooo!",
    "I need that skin!",
    "Best streamer ever",
    "How do you even do that?",
    "Insane skills!",
    "This is better than Netflix",
    "I'm learning so much",
    "The suspense is killing me",
    "Team [player/team name]!",
    "I wish I could play like that",
    "Is this real life?",
    "The graphics though!",
    "This is my favorite game",
    "I'm here for the memes",
    "This is intense!",
    "Heart rate: 1000 bpm",
    "That was a close one",
    "GG, WP",
    "We need a replay",
    "Can't believe my eyes",
    "This game never gets old",
    "I'm rooting for [player/team name]",
    "That was a masterclass",
    "Can't wait for the next stream",
    "This is legendary",
    "I need some snacks for this",
    "Is this the final round?",
    "Speechless",
    "This is too good",
    "My favorite part of the day",
    "I'm a fan for life",
    "This is better than reality TV",
    "I need to practice more",
    "The tension is real",
    "This game is a rollercoaster",
    "Never seen anything like this",
    "I'm on the edge of my seat",
    "This is peak gaming",
    "I'm here for the drama",
    "This gameplay is smooth",
    "The strategy is unreal",
    "I'm so invested in this",
    "Can't get enough of this stream",
    "This is my daily dose of entertainment",
    "The energy in here is amazing",
    "I'm in awe",
    "This is top-tier content",
    "I'm obsessed with this game",
    "This is a nail-biter",
    "The plays are mind-blowing",
    "I'm here every day",
    "This is my escape",
    "I'm a lifelong fan",
    "This is the best community",
    "I'm loving every second",
    "This is epic gaming",
    "I'm blown away",
    "This is the highlight of my day",
    "I'm totally hooked",
    "This is gaming at its finest",
    "I'm here for the long haul",
    "This is the best part of my week",
    "I'm amazed every time",
    "This is non-stop action",
    "I'm a true believer",
    "This is the ultimate gaming experience",
    "I'm a dedicated viewer",
    "This is the pinnacle of entertainment",
    "I'm totally immersed",
    "This is the best stream ever",
    "I'm a part of something special",
    "This is gaming history",
    "I'm here for every stream",
    "This is the best of the best",
    "I'm a committed follower",
    "This is the heart of gaming",
    "I'm a true fan",
    "This is the soul of legendary gameplay",
    "I'm forever a supporter",
    "This is the zenith of streaming",
    "I'm all in",
    "This is the core of the community",
    "I'm here to stay",
    "This is the apex of gaming",
    "I'm a permanent member",
    "This is the epitome of gaming",
  ]

  const getRandomElement = (arr: string[]) => {
    const index = Math.floor(Math.random() * arr.length)
    return arr[index]
  }

  const randomComment = getRandomElement(comments)
  const emoji = getRandomElement(emojis)
  return `${randomComment} ${emoji}`
}

export { generateMessage }
