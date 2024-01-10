import { useLayoutEffect, useMemo, useRef } from "react"

function debounce<FuncArgs extends any[]>(
  func: (...args: FuncArgs) => void,
  timeout = 300
) {
  let timer: NodeJS.Timeout
  return {
    fn: (...args: FuncArgs) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        func.apply(args)
      }, timeout)
    },
    cancel: () => {
      clearTimeout(timer)
    },
  }
}

export function useDebounce<CallbackArgs extends any[]>(
  callback: (...args: CallbackArgs) => void,
  delay: number
) {
  const callbackRef = useRef(callback)
  useLayoutEffect(() => {
    callbackRef.current = callback
  })
  return useMemo(
    () =>
      debounce<CallbackArgs>((...args) => callbackRef.current(...args), delay),
    [delay]
  )
}
