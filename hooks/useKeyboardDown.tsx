import { useCallback, useEffect } from "react"

export const useKeyboardDown = (key: string, callback: () => void) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === key) {
        callback()
      }
    },
    [callback, key]
  )
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])
}
