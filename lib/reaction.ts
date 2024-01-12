const getEmojiFromCode = (code: string) => {
  return String.fromCodePoint(parseInt(code, 16))
}
