export const getReactionFromCode = (code: string) => {
  return String.fromCodePoint(parseInt(code, 16))
}
